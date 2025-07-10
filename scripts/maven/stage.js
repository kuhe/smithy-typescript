#!/usr/bin/env node

const { spawnProcessReturnValue, spawnProcess } = require("../utils/spawn-process");
const { SecretsManager } = require("@aws-sdk/client-secrets-manager");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");

(async () => {
  // 1. Read the prospective version from gradle properties, also checking the existing
  // remote version.
  const { existsOnMaven } = await readLibraryVersion();

  // 2. Build the project.
  await buildLibrary();
  // 3. Locally stage to `./build/staging`.
  await spawnProcess("./gradlew", ["publish"], {
    cwd: root,
  });

  // 3. run jreleaser.
  await runJReleaser({ existsOnMaven });
})();

/**
 * Runs gradle jreleaser.
 *
 * @param {boolean} existsOnMaven
 * @returns {Promise<void>}
 */
async function runJReleaser({ existsOnMaven }) {
  const sm = new SecretsManager({
    region: "us-west-2",
  });
  const secrets = {
    SMITHY_PUBLISH_keyId: "",
    SMITHY_PUBLISH_sonatypeUser: "",
    SMITHY_PUBLISH_sonatypePassword: "",
    SMITHY_PUBLISH_signingKey: "",
    SMITHY_PUBLISH_signingPassword: "",
    SMITHY_PUBLISH_signingEmail: "",
  };

  for (const secret in secrets) {
    secrets[secret] =
      (
        await sm
          .getSecretValue({
            SecretId: secret,
          })
          .catch(() => Object())
      ).SecretString ?? "";
  }

  console.info("Fetching public key.");
  await spawnProcess(
    "gpg",
    [
      `--no-default-keyring`,
      `--keyserver`,
      `hkps://keyserver.ubuntu.com:443`,
      `--recv-key`,
      `${secrets.SMITHY_PUBLISH_keyId}`,
    ],
    {
      cwd: root,
    }
  );
  console.info("Loading public key.");
  process.env.SMITHY_PUBLISH_signingEmail ??= secrets.SMITHY_PUBLISH_signingEmail;
  process.env.JRELEASER_GPG_PUBLIC_KEY = await spawnProcessReturnValue(
    "gpg",
    ["--armor", "--export", process.env.SMITHY_PUBLISH_signingEmail],
    {
      cwd: root,
    }
  );
  console.info("✅ GPG public key loaded.");

  process.env.JRELEASER_GPG_PASSPHRASE ??= secrets.SMITHY_PUBLISH_signingPassword;
  process.env.JRELEASER_GPG_SECRET_KEY ??= secrets.SMITHY_PUBLISH_signingKey;
  process.env.JRELEASER_GENERIC_TOKEN ??= "dummy-token";
  process.env.JRELEASER_MAVENCENTRAL_USERNAME ??= secrets.SMITHY_PUBLISH_sonatypeUser;
  process.env.JRELEASER_MAVENCENTRAL_PASSWORD ??= secrets.SMITHY_PUBLISH_sonatypePassword;
  process.env.JRELEASER_MAVENCENTRAL_STAGE ??= "UPLOAD";

  if (existsOnMaven) {
    console.info(`Running jreleaser jreleaserFullRelease --dry-run`);
    await spawnProcess("./gradlew", ["jreleaserConfig", "jreleaserFullRelease", "--dry-run"]);
  } else {
    console.info(`Running jreleaser jreleaserFullRelease`);
    await spawnProcess("./gradlew", [
      "-Dorg.gradle.daemon=false",
      "-Dorg.gradle.parallel=false",
      "jreleaserConfig",
      "jreleaserFullRelease",
    ]);
  }
  console.info("✅ jreleaser run completed.");
}

/**
 * @returns {Promise<{existsOnMaven: boolean, reportedVersion: *, configuredVersion: string}>}
 */
async function readLibraryVersion() {
  console.info("Reading library version.");

  const properties = await spawnProcessReturnValue(`./gradlew`, ["properties", "-q"], {
    cwd: root,
  });
  const rootBuildDotGradle = fs.readFileSync(path.join(root, "build.gradle.kts"), "utf-8");
  const lines = rootBuildDotGradle.split("\n");
  const versionDeclaration = lines.slice(lines.indexOf("allprojects {"), lines.indexOf("allprojects {") + 3);
  const configuredVersion = versionDeclaration[2].split("version = ")[1]?.replace(/"/g, "");

  const reportedVersion = properties
    .split("\n")
    .filter((line) => line.startsWith("version: "))?.[0]
    .split(`version: `)?.[1];

  const isTriNumeric = reportedVersion.match(/\d+\.\d+\.\d+/) && configuredVersion.match(/\d+\.\d+\.\d+/);

  if (!isTriNumeric) {
    throw new Error(
      `❌ configuredVersion: ${configuredVersion} or reportedVersion: ${reportedVersion} does not match tri-numeric pattern.`
    );
  }

  if (reportedVersion !== configuredVersion) {
    throw new Error(`❌ configuredVersion: ${configuredVersion} and reportedVersion: ${reportedVersion} do not match.`);
  }

  console.log(`✅ reported and configured versions match`, {
    reportedVersion,
    configuredVersion,
  });

  const maven2 = {
    smithyTs: `https://repo1.maven.org/maven2/software/amazon/smithy/typescript/smithy-typescript-codegen/${configuredVersion}/`,
    smithyAwsTs: `https://repo1.maven.org/maven2/software/amazon/smithy/typescript/smithy-typescript-codegen/${configuredVersion}/`,
  };

  const existsOnMaven = await fetch(maven2.smithyTs).then((res) => {
    if (res.status >= 400) {
      return false;
    }
    return true;
  });

  if (existsOnMaven) {
    console.info(`⚠️❌ version already exists on remote repository.`);
  } else {
    console.info(`✅ version does not exist on remote repository.`);
  }

  return {
    existsOnMaven,
    reportedVersion,
    configuredVersion,
  };
}

/**
 * @returns {Promise<void>} after finishing gradlew clean build pTML.
 */
async function buildLibrary() {
  console.info("Running gradle build.");
  await spawnProcess("./gradlew", ["clean", "build", "pTML"], {
    cwd: root,
  });
  console.log(`✅ Gradle build succeeded.`);
}
