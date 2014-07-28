/// <reference path="libs/require.js" />
/// <reference path="libs/sammy-0.7.4.js" />
/// <reference path="libs/jquery-2.0.3.js" />

(function () {

    require.config({
        paths: {
            "jquery": "libs/jquery-2.0.3.min",
            "mustache": "libs/mustache",
            "sammy": "libs/sammy-0.7.4",
            "rsvp": "libs/rsvp.min",
            "http-requester": "libs/http-requester",
            "load-chat": "libs/load-chat"
        }
    })

    require(["jquery", "sammy", "mustache", "rsvp", "http-requester", "load-chat"],
                     function ($, sammy, mustache, rsvp, request, load) {
                         var app = sammy("#main-content", function () {
                             this.get("#/", function () {
                                 $("#main-content").html("View the main page");
                             });

                             this.get("#/chat", function () {
                                 this.partial('PartialHTMLs/chatForm.html');
                                 load.loadChat('#msg-content', -20);
                             });

                             this.get("#/send", function () {
                                 var userName = $("#user-name").val();
                                 var message = $("#message").val();

                                 request.postJSON("http://crowd-chat.herokuapp.com/posts", { user: userName, text: message })
                                 alert('click');
                             });

                             this.get("#/allMessages", function () {
                                 this.partial('PartialHTMLs/allMessages.html');
                                 load.loadChat("#main-content");

                             });

                         });

                         app.run("#/");

                     });
}());