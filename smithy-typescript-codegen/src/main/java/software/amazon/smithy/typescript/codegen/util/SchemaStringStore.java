package software.amazon.smithy.typescript.codegen.util;

import software.amazon.smithy.typescript.codegen.TypeScriptWriter;

import java.nio.file.Path;

public class SchemaStringStore extends StringStore {
    private final TypeScriptWriter writer;

    public SchemaStringStore(TypeScriptWriter writer) {
        this.writer = writer;
    }

    @Override
    public String var(String literal) {
        String v = super.var(literal);
        writer.addRelativeImport(v, null, Path.of("./schemas_0"));
        return v;
    }

    @Override
    public String var(String literal, String preferredPrefix) {
        String v = super.var(literal, preferredPrefix);
        writer.addRelativeImport(v, null, Path.of("./schemas_0"));
        return v;
    }
}
