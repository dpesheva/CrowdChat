define(["jquery", "mustache", "rsvp", "http-requester"], function ($, mustache, rsvp, request) {
    function loadChat(elementId, number) {
        var partialData = [];

        request.getJSON("http://crowd-chat.herokuapp.com/posts")
                                            .then(function (data) {
                                                if (number) {
                                                    partialData = data.slice(number).reverse();
                                                } else {
                                                    partialData = data.slice(0);
                                                }

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
                                                $(elementId).html(messageList);
                                            }
                                            , function (err) {
                                                $("#main-content").html(err);
                                            })
    }

    return {
        loadChat: loadChat
    };
});