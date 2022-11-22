"use strict";

var mainApp = angular.module("mainApp", [
  "ngRoute",
  "ngFlash",
  "ngSanitize",
  "mainControllers",
  "mainServices",
  "mainBusinessServices",
  "mainDirectives"
]);

mainApp.config([
  "$routeProvider",
  "$locationProvider",
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "partials/main.html",
        controller: "IndexCtrl",
      })
      .when("/editorials/new", {
        templateUrl: "partials/createEditorial.html",
        controller: "CreateEditorialCtrl",
      })
      .when("/submission/:id", {
        templateUrl: "partials/viewSubmission.html",
        controller: "ViewSubmissionCtrl",
      })
      .when("/problems/new", {
        templateUrl: "partials/problemForm.html",
        controller: "CreateProblemCtrl",
      })
      .when("/problems/:id/submit", {
        templateUrl: "partials/submitProblem.html",
        controller: "SubmitProblemCtrl",
      })
      .when("/problems", {
        templateUrl: "partials/problems.html",
        controller: "ProblemCtrl",
      })
      .when("/categories/:id/delete", {
        template: `<p>Delete Category</p>`,
        controller: "DeleteCategoriesCtrl",
      })
      .when("/categories/:id/edit", {
        templateUrl: "partials/categoryForm.html",
        controller: "EditCategoriesCtrl",
      })
      .when("/categories/new", {
        templateUrl: "partials/categoryForm.html",
        controller: "CreateCategoryCtrl",
      })
      .when("/categories", {
        templateUrl: "partials/categories.html",
        controller: "CategoriesCtrl",
      })
      .when("/blogPost/:id", {
        templateUrl: "partials/blogPost.html",
        controller: "BlogViewCtrl",
      })
      .when("/login", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl",
      })
      .when("/register", {
        templateUrl: "partials/register.html",
        controller: "RegisterCtrl",
      })
      .when("/logout", {
        templateUrl: "partials/login.html",
        controller: "LogoutCtrl",
      });
    $locationProvider.html5Mode(false).hashPrefix("!");
  },
]);
