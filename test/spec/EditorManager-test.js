/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */


/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, describe, it, spyOn, expect, beforeEach, afterEach, waitsFor, runs, $ */

define(function (require, exports, module) {
    'use strict';
    
    var EditorManager    = require("editor/EditorManager"),
        WorkspaceManager = require("view/WorkspaceManager"),
        MainViewManager  = require("view/MainViewManager"),
        SpecRunnerUtils  = require("spec/SpecRunnerUtils");

    // TODO -- This is a workspace layout thing now so we need to repurpose this 
    describe("EditorManager", function () {

        MainViewManager._initialize();
        
        describe("Create Editors", function () {
            var pane, testEditor, testDoc, $root, $fakeContentDiv, $fakeHolder;
            
            beforeEach(function () {
                // Normally the editor holder would be created inside a "content" div, which is
                // used in the available height calculation. We create a fake content div just to
                // hold the height, and we'll place the editor holder in it.
                $fakeContentDiv = $("<div class='content'/>")
                    .css("height", "200px")
                    .appendTo(document.body);
                
                $fakeHolder = SpecRunnerUtils.createMockElement()
                                            .css("width", "1000px")
                                            .attr("id", "mock-editor-holder")
                                            .appendTo($fakeContentDiv);

                pane = SpecRunnerUtils.createMockPane($fakeHolder);
                testDoc = SpecRunnerUtils.createMockDocument("");
            });
            
            afterEach(function () {
                $fakeHolder.remove();
                $fakeHolder = null;

                $fakeContentDiv.remove();
                $fakeContentDiv = null;
                
                SpecRunnerUtils.destroyMockEditor(testDoc);
                testEditor = null;
                testDoc = null;
                pane = null;
                $root = null;
                EditorManager.resetViewStates();
            });
            
            it("should create a new editor for a document and add it to a pane", function () {
                spyOn(pane, "addView");
                EditorManager.doOpenDocument(testDoc, pane);
                expect(pane.addView).toHaveBeenCalled();
            });
            
            it("should use an existing editor for a document and show the editor", function () {
                spyOn(pane, "addView");
                spyOn(pane, "showView");
                var editor = SpecRunnerUtils.createEditorInstance(testDoc, pane.$el);
                EditorManager.doOpenDocument(testDoc, pane);
                expect(pane.showView).toHaveBeenCalled();
                expect(pane.addView).toHaveBeenCalled();
                expect(pane.addView.calls[0].args[1]).toEqual(editor);
            });
            
            
//            this is an integration test
//            it("should report the existing editor as the current full editor", function () {
//                var editor = SpecRunnerUtils.createEditorInstance(testDoc, pane.$el);
//                EditorManager.doOpenDocument(testDoc, pane);
//                expect(EditorManager.getCurrentFullEditor()).toEqual(editor);
//            });
//
//            this is an integration test
//            it("should notify when active editor changes", function () {
//                var called = false,
//                    other;
//
//                spyOn(pane, "addView");
//                function callback(newEditor) {
//                    called = true;
//                    other = newEditor;
//                }
//                
//                $(EditorManager).on("activeEditorChange", callback);
//                EditorManager.doOpenDocument(testDoc, pane);
//                expect(called).toBe(true);
//                expect(pane.addView.calls[0].args[1]).toEqual(other);
//            });
            
            it("should remember a file's view state", function () {
                EditorManager.addViewStates({ a: "1234" });
                expect(EditorManager.getViewState("a")).toEqual("1234");
            });

            it("should extend the view state cache", function () {
                EditorManager.addViewStates({ a: "1234" });
                EditorManager.addViewStates({ b: "5678" });
                expect(EditorManager.getViewState("a")).toEqual("1234");
                expect(EditorManager.getViewState("b")).toEqual("5678");
            });
            
            it("should reset the view state cache", function () {
                EditorManager.addViewStates({ a: "1234" });
                EditorManager.addViewStates({ b: "5678" });
                EditorManager.resetViewStates();
                expect(EditorManager.getViewState("a")).toBeUndefined();
                expect(EditorManager.getViewState("b")).toBeUndefined();
            });
            
//this is an integration test
//it(
//    "should report the existing editor as the current full editor", function () {
//    var editor = SpecRunnerUtils.createEditorInstance(testDoc, pane.$el);
//    EditorManager.doOpenDocument(testDoc, pane);
//    expect(EditorManager.getCurrentFullEditor()).toEqual(editor);
//});            
                        
/**
No longer an editor-manager test since editor-manager doesn't handle the event anymore
            // force cases
            it("should refresh if force is specified even if no width or height change", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_FORCE);
                expect(testEditor.refreshAll).toHaveBeenCalled();
            });
            it("should refresh if force is specified when width changed but height hasn't", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.width(300); // change the width
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_FORCE);
                expect(testEditor.refreshAll).toHaveBeenCalled();
            });

            it("should refresh if force is specified when height changed but width hasn't", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.height(300); // change the height (to be different from content div)
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_FORCE);
                expect(testEditor.refreshAll).toHaveBeenCalled();
            });

            it("should refresh if force is specified when both height and width changed", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.height(300); // change the height (to be different from content div)
                $root.width(300); // change the width
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_FORCE);
                expect(testEditor.refreshAll).toHaveBeenCalled();
            });

            // skip cases
            it("should NOT refresh if skip is specified if no width or height change", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_SKIP);
                expect(testEditor.refreshAll).not.toHaveBeenCalled();
            });

            it("should NOT refresh if skip is specified when width changed but height hasn't", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.width(300); // change the width
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_SKIP);
                expect(testEditor.refreshAll).not.toHaveBeenCalled();
            });

            it("should NOT refresh if skip is specified when height changed but width hasn't", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.height(300); // change the height (to be different from content div)
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_SKIP);
                expect(testEditor.refreshAll).not.toHaveBeenCalled();
            });

            it("should NOT refresh if skip is specified when both height and width changed", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.height(300); // change the height (to be different from content div)
                $root.width(300); // change the width
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout(EditorManager.REFRESH_SKIP);
                expect(testEditor.refreshAll).not.toHaveBeenCalled();
            });
            
            // unspecified cases
            it("should NOT refresh if unspecified if no width or height change", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout();
                expect(testEditor.refreshAll).not.toHaveBeenCalled();
            });

            it("should refresh if unspecified when width changed but height hasn't", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.width(300); // change the width
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout();
                expect(testEditor.refreshAll).toHaveBeenCalled();
            });

            it("should refresh if unspecified when height changed but width hasn't", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.height(300); // change the height (to be different from content div)
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout();
                expect(testEditor.refreshAll).toHaveBeenCalled();
            });

            it("should refresh if unspecified when both height and width changed", function () {
                $root.height(200); // same as content div, so shouldn't be detected as a change
                $root.width(200);
                WorkspaceManager.recomputeLayout(); // cache the width
                $root.height(300); // change the height (to be different from content div)
                $root.width(300); // change the width
                
                spyOn(testEditor, "refreshAll");
                WorkspaceManager.recomputeLayout();
                expect(testEditor.refreshAll).toHaveBeenCalled();
            });
**/
        });
        
    });
});
