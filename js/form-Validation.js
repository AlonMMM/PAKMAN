/**
 * Created by windows on 06/05/2017.
 */
$().ready($(function () {

    $.validator.addMethod("isUserExist", function (user) {
        return (user in users) == false;
    }, "username already taken.");

    // add methods to the validator
    $.validator.addMethod("isCorrectPassword", function (value, element) {
        return this.optional(element) || /^(?=.*[a-zA-Z])(?=.*\d).*$/.test(value);
    }, "password should be at least 8 digit and contains letter and numbers");

    $.validator.addMethod("isCorrectName", function (value, element) {
        return this.optional(element) || /^[a-zA-Z]*$/.test(value);
    }, "Name should contain only letters");
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("#sign_up").validate({

        // Specify validation rules
        rules: {
            nick_name: {
                required: true,
                isUserExist: true
            },
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            firstname: {
                required: true,
                isCorrectName: true
            },
            lastname: {
                required: true,
                isCorrectName: true
            },
            email: {
                required: true,
                // Specify that email should be validated
                // by the built-in "email" rule
                email: true
            },
            password: {
                required: true,
                minlength: 8,
                isCorrectPassword: true
            }

        },
        // Specify validation error messages
        messages: {
            firstname: {
                required: "Please enter your firstname"
            },
            lastname: {
                required: "Please enter your lastname"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 8 characters long"
            },
            email: "Please enter a valid email address",
            nick_name: {
                required: "Please provide a nick name",
                isUserExist: "User name already exist"
            },
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
    });
    $("#sign_up").submit(function (event) {
        if ($("#sign_up").valid()) {
            users[$("#nick_name")[0].value] = $("#password")[0].value;
            $("#REGISTER").hide();
            nick_name = $("#nick_name")[0].value;
            logAfterRegister(nick_name);
        }
    });

    for (var i = 1948; i <= 2016; i++) {
        var option = new Option();
        option.value = option.text = i;
        $("#year")[0].add(option);
    }

    for (var i = 1; i <= 12; i++) {
        var option = new Option();
        option.value = option.text = i;
        $("#month")[0].add(option);
    }

    for (var i = 1; i <= 31; i++) {
        var option = new Option();
        option.value = option.text = i;
        $("#day")[0].add(option);
    }
}));