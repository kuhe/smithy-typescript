/*
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package software.amazon.smithy.typescript.codegen.endpointsV2;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import software.amazon.smithy.model.node.ArrayNode;
import software.amazon.smithy.model.node.Node;
import software.amazon.smithy.model.node.ObjectNode;
import software.amazon.smithy.model.node.StringNode;
import software.amazon.smithy.typescript.codegen.TypeScriptWriter;


public class RuleSetSerializer {
    private final Node ruleSet;
    private final TypeScriptWriter writer;

    public RuleSetSerializer(Node ruleSet, TypeScriptWriter writer) {
        this.ruleSet = ruleSet;
        this.writer = writer;
    }

    /**
     * Write the ruleset as a JSON object.
     */
    public void generate() {
        traverse(ruleSet);
    }

    private void traverse(Node node) {
        if (node.isObjectNode()) {
            ObjectNode objectNode = node.expectObjectNode();

            writer.openBlock(
                "{",
                "}",
                () -> {
                    // note: OOM if converting entrySet to List for iteration.
                    Iterator<Map.Entry<StringNode, Node>> iterator =
                        objectNode.getMembers().entrySet().iterator();

                    while (iterator.hasNext()) {
                        Map.Entry<StringNode, Node> member = iterator.next();
                        writer.writeInline("\"" + member.getKey() + "\": ");
                        traverse(member.getValue());
                        if (iterator.hasNext()) {
                            writer.writeInline(",");
                        }
                    }
                }
            );
        } else if (node.isArrayNode()) {
            ArrayNode arrayNode = node.expectArrayNode();
            writer.openBlock(
                "[",
                "]",
                () -> {
                    List<Node> elements = arrayNode.getElements();
                    for (int i = 0; i < elements.size(); i++) {
                        traverse(elements.get(i));
                        if (i < elements.size() - 1) {
                            writer.writeInline(",");
                        }
                    }
                }
            );
        } else if (node.isBooleanNode()) {
            writer.write("$L", node.expectBooleanNode().getValue());
        } else if (node.isNumberNode()) {
            Number number = node.expectNumberNode().getValue();

            float floatValue = number.floatValue();
            int intValue = number.intValue();

            if (floatValue == Math.floor(floatValue)) {
                writer.write("$L", intValue);
            } else {
                writer.write("$L", floatValue);
            }
        } else if (node.isStringNode()) {
            String stringValue = node.expectStringNode().getValue();
            writer.write(
                "$L",
                "\"" + stringValue.replaceAll("\"", "\\\"") + "\""
            );
        }
    }
}
