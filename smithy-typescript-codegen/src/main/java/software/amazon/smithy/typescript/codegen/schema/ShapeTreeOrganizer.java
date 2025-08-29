/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

package software.amazon.smithy.typescript.codegen.schema;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import software.amazon.smithy.model.Model;
import software.amazon.smithy.model.knowledge.TopDownIndex;
import software.amazon.smithy.model.shapes.MemberShape;
import software.amazon.smithy.model.shapes.OperationShape;
import software.amazon.smithy.model.shapes.ServiceShape;
import software.amazon.smithy.model.shapes.Shape;
import software.amazon.smithy.model.shapes.ShapeId;
import software.amazon.smithy.utils.SmithyInternalApi;

/**
 * Creates schema groupings.
 * E.g. used to create disjoint sets of schemas to assist with tree-shaking.
 */
@SmithyInternalApi
public class ShapeTreeOrganizer {
    public static final String FILENAME_PREFIX = "schemas";

    private static final Map<Model, ShapeTreeOrganizer> INSTANCES = new ConcurrentHashMap<>();
    private final Map<ShapeId, TreeSet<ShapeId>> shapeToOperationDependents = new HashMap<>();
    private final Map<String, Integer> opGroups = new HashMap<>();
    private int lastGroup = 0;
    private Model model;

    public static ShapeTreeOrganizer forModel(Model model) {
        return INSTANCES.computeIfAbsent(model, k -> {
            ShapeTreeOrganizer shapeTreeOrganizer = new ShapeTreeOrganizer();
            shapeTreeOrganizer.loadModel(model);
            return shapeTreeOrganizer;
        });
    }

    /**
     * Set the context for this instance.
     */
    public void loadModel(Model model) {
        if (this.model != null) {
            throw new IllegalArgumentException("Model has already been loaded");
        }
        this.model = model;
        for (ServiceShape service : model.getServiceShapes()) {
            for (OperationShape operation : TopDownIndex.of(model).getContainedOperations(service)) {
                readOperationClosure(operation, new HashSet<>());
            }
        }
    }

    /**
     * @return the group name (filename) of the schema group for the given shape.
     */
    public String getGroup(ShapeId id) {
        if (!shapeToOperationDependents.containsKey(id)) {
            return getBaseGroup();
        }
        TreeSet<ShapeId> operations = shapeToOperationDependents.get(id);
        return hashOperationSet(operations);
    }

    /**
     * @return a string hash identifying the group that this set of operations is assigned to.
     */
    private String hashOperationSet(Set<ShapeId> operations) {
        if (operations.size() > 5) {
            return getBaseGroup();
        }
        String combinedNames = operations.stream().map(ShapeId::getName).collect(Collectors.joining(","));
        if (opGroups.containsKey(combinedNames)) {
            return FILENAME_PREFIX + "_" + opGroups.get(combinedNames);
        } else {
            opGroups.put(combinedNames, ++lastGroup);
        }
        return FILENAME_PREFIX + "_" + lastGroup;
    }

    private String getBaseGroup() {
        return FILENAME_PREFIX + "_0";
    }

    /**
     * Make known that a shape id is used within a certain operation.
     */
    private void register(ShapeId operationId, ShapeId shapeId) {
        shapeToOperationDependents.computeIfAbsent(shapeId, k -> new TreeSet<>()).add(operationId);
    }

    /**
     * Explore the set of shapes in the closure of an operation.
     */
    private void readOperationClosure(OperationShape op, Set<Shape> visited) {
        registerShapes(op, op, visited);
        op.getInput().ifPresent(inputShape -> {
            registerShapes(op, model.expectShape(inputShape), visited);
        });
        op.getOutput().ifPresent(outputShape -> {
            registerShapes(op, model.expectShape(outputShape), visited);
        });
        op.getErrors().forEach(error -> {
            registerShapes(op, model.expectShape(error), visited);
        });
    }

    private void registerShapes(OperationShape op, Shape shape, Set<Shape> visited) {
        if (shape.isMemberShape()) {
            registerShapes(op, model.expectShape(shape.asMemberShape().get().getTarget()), visited);
            return;
        }
        if (visited.contains(shape)) {
            return;
        }
        visited.add(shape);
        register(op.getId(), shape.getId());

        Set<Shape> memberTargetShapes = shape.getAllMembers().values().stream()
            .map(MemberShape::getTarget)
            .map(model::expectShape)
            .collect(Collectors.toSet());

        for (Shape memberTargetShape : memberTargetShapes) {
            registerShapes(op, memberTargetShape, visited);
        }
    }

    void debug() {
        shapeToOperationDependents.forEach((shapeId, operations) -> {
            System.out.println(shapeId);
            System.out.println("  " + getGroup(shapeId));
            System.out.println(
                "    operations: " + operations.stream()
                    .map(ShapeId::getName).collect(Collectors.joining(", "))
            );
            System.out.println();
        });
    }
}
