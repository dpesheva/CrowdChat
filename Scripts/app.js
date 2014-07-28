﻿/// <reference path="libs/require.js" />
/// <reference path="libs/sammy-0.7.4.js" />
/// <reference path="libs/jquery-2.0.3.js" />


(function () {

    require.config({
        paths: {
            "jquery": "libs/jquery-2.0.3.min",
            "mustache": "libs/mustache",
            "sammy": "libs/sammy-0.7.4",
            "rsvp": "libs/rsvp.min",
            "http-requester": "libs/http-requester"
        }
    })

    require(["jquery", "sammy", "mustache", "rsvp", "http-requester"],
                     function ($, sammy, mustache, rsvp, request) {
                         var app = sammy("#main-content", function () {
                             this.get("#/", function () {
                                 $("#main-content").html("View the students page");
                             });

                             this.get("#/about", function () {
                                 $("#main-content").html("about");
                             });

                             this.get("#/chat", function () {
                                 this.partial('PartialHTMLs/chatForm.html');

                                 request.getJSON("http://crowd-chat.herokuapp.com/posts")
                                    .then(function (data) {
                                        var partialData = [];

                                        partialData = data.slice(-20);

                                        var messageList = $("<ul />").addClass("message-list");
                                        var templateString = $("#msg-template").html();
                                        var template = mustache.compile(templateString);
                                        for (var i in partialData) {
                                            var message = partialData[i];
                                            var templatedMessage = template(message);
                                            var messageItem =
                                                $("<li />")
                                                    .addClass("message-item")
                                                        .html(templatedMessage);
                                            messageList.append(messageItem);
                                        }
                                        $('#msg-content').html(messageList);
                                    }
                                    , function (err) {
                                        $("#main-content").html(err);
                                    })

                             });

                             this.get("#/allMessages", function () {
                                 this.partial('PartialHTMLs/allMessages.html');
                                 request.getJSON("http://crowd-chat.herokuapp.com/posts")
                                     .then(function (data) {
                                         var messageList = $("<ul />").addClass("message-list");
                                         var templateString = $("#msg-template").html();
                                         var template = mustache.compile(templateString);
                                         for (var i in data) {
                                             var message = data[i];
                                             var templatedMessage = template(message);
                                             var messageItem =
                                                 $("<li />")
                                                     .addClass("message-item")
                                                         .html(templatedMessage);
                                             messageList.append(messageItem);
                                         }
                                         $("#main-content").html(messageList);
                                     }
                                     , function (err) {
                                         $("#main-content").html(err);
                                     })
                             });

                             this.get("#/student/:id", function () {
                                 request.getJSON("api/students/" + this.params["id"] + "/marks")
                                     .then(function (marks) {
                                         var marksList = $('<ul/>').addClass("marks-list");
                                         var templateString = $("#mark-template").html();
                                         var template = mustache.compile(templateString);
                                         for (var i in marks) {
                                             var mark = marks[i];
                                             var templatedMark = template(mark);
                                             //marksList.append(templatedMark);
                                             var markItem =
                                                 $("<li />")
                                                     .addClass("mark-item")
                                                         .html(templatedMark);
                                             marksList.append(markItem);
                                         }
                                         $("#main-content").html(marksList);
                                     });
                             });


                         });

                         app.run("#/");

                     });
}());