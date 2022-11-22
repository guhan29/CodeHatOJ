"use strict";

var mainControllers = angular.module("mainControllers", []);

mainControllers.controller("IndexCtrl", [
  "$scope",
  "$location",
  "checkCreds",
  "getUsername",
  "Flash",
  function IndexCtrl($scope, $location, checkCreds, getUsername, Flash) {
    if (checkCreds()) {
      $scope.username = getUsername();
    }
    $scope.isAuthenticated = checkCreds;
  },
]);

mainControllers.controller("NavCtrl", [
  "$scope",
  "$location",
  "checkCreds",
  "getUsername",
  "Flash",
  function NavCtrl($scope, $location, checkCreds, getUsername, Flash) {
    if (checkCreds()) {
      $scope.username = getUsername();
    }
    $scope.isAuthenticated = checkCreds;
  }
]);

mainControllers.controller("BlogViewCtrl", [
  "$scope",
  "$routeParams",
  "BlogPost",
  "$location",
  "checkCreds",
  function BlogViewCtrl($scope, $routeParams, BlogPost, $location, checkCreds) {
    if (!checkCreds()) {
      $location.path("/login");
    }

    var blogId = $routeParams.id;
    $scope.blg = 1;

    BlogPost.get(
      { id: blogId },
      function success(res) {
        console.log("Success: " + JSON.stringify(res));
        $scope.blogEntry = res;
      },
      function error(err) {
        console.log("Error: " + JSON.stringify(err));
      }
    );
  },
]);

mainControllers.controller("LoginCtrl", [
  "$scope",
  "$location",
  "Login",
  "setCreds",
  "Flash",
  function LoginCtrl($scope, $location, Login, setCreds, Flash) {
    $scope.email = "";
    $scope.password = "";
    $scope.error = null;

    $scope.submit = function () {
      var postData = {
        email: $scope.email,
        password: $scope.password,
      };

      Login.login(
        {},
        postData,
        function success(res) {
          let username = res.user.username;
          let email = res.user.email;
          let uid = res.user._id;
          let token = res.token;
          console.log("Success:" + JSON.stringify(res));
          res.authenticated = true;
          setCreds(username, email, uid, token);
          $location.path("/");
          Flash.create('success', 'Successfully logged in.')
        },
        function error(err) {
          $scope.error = err.data.error;
        }
      );
    };
  },
]);

mainControllers.controller("RegisterCtrl", [
  "$scope",
  "$location",
  "$http",
  "Flash",
  function RegisterCtrl($scope, $location, $http, Flash) {
     // Flash.create('success', 'Success', 10000);
    $scope.email = "";
    $scope.password = "";
    $scope.username = "";
    $scope.confirmPassword = "";
    $scope.error = null;

    $scope.submit = function () {
      var postData = {
        email: $scope.email,
        username: $scope.username,
        password: $scope.password
      };

      console.log(postData);
      if (!$scope.email || !$scope.password || !$scope.confirmPassword || !$scope.username) {
        Flash.create('danger', 'All fields are required', 10000);
        return;
      }
      if ($scope.password != $scope.confirmPassword) {
        Flash.create('danger', 'Passwords do not match', 10000);
        return;
      }

      $http({
        url: '/api/users',
        method: "POST",
        data: postData
      })
      .then(function(res) {
        $location.path("/login");
        Flash.create('success', 'Success created account! <strong>Login now!</strong>', 10000);
      }, 
      function(err) {
        Flash.create('danger', err.data.error, 10000);
        console.log(err);
      });
    };
  },
]);

mainControllers.controller("LogoutCtrl", [
  "$location",
  "deleteCreds",
  "Flash",
  function LogoutCtrl($location, deleteCreds, Flash) {
    deleteCreds();
    $location.path("/login");
    Flash.create('success', 'Successfully logged put!.')
  },
]);


// Categories
mainControllers.controller('CreateCategoryCtrl', [
  "$scope",
  "$http",
  "$location",
  "Flash",
  'getToken',
  function CreateCategoryCtrl($scope, $http, $location, Flash, getToken) {
    console.log('CreateCategoryCtrl');
    $scope.submit = function() {
      var postData = {
        name: $scope.name
      };
      $http({
        url: '/api/categories',
        method: "POST",
        data: postData,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(function(res) {
        console.log(res);
        $scope.name = '';
        $location.path("/categories/new");
        Flash.create('success', `Success created category <strong>${postData.name}!</strong>`, 10000);
      }, 
      function(err) {
        let error = err.data.error;
        if (!error && err.status == 401) {
          error = `<strong>${err.data}!</strong> You should login inorder to submit`;
        }
        Flash.create('danger', error, 10000);
        console.log(err);
      });
    }
  }
]);

mainControllers.controller('CategoriesCtrl', [
  "$scope",
  "$http",
  "$location",
  "Flash",
  'getToken',
  function CategoriesCtrl($scope, $http, $location, Flash, getToken) {
    console.log('CategoriesCtrl');
    $scope.categories = [];
    $http({
      url: '/api/categories',
      method: "GET"
    })
    .then(function(res) {
      console.log(res);
      $scope.categories = res.data
    }, 
    function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should logint`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    });
  }
]);


mainControllers.controller('DeleteCategoriesCtrl', [
  "$scope",
  "$http",
  "$routeParams",
  "$location",
  "Flash",
  'getToken',
  'checkCreds',
  function DeleteCategoriesCtrl($scope, $http, $routeParams, $location, Flash, getToken, checkCreds) {
    console.log('DeleteCategoriesCtrl');
    if (!checkCreds()) {
      $location.path("/login");
      Flash.create('danger', 'You should login inorder to edit', 10000);
    }
    
    let categoryId = $routeParams.id;
    $http({
      url: `/api/categories/${categoryId}`,
      method: "DELETE",
      headers: {
        'Authorization': 'Bearer ' + getToken()
      }
    })
    .then(function(res) {
      console.log(res);
      window.history.back();
    }, 
    function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should logint`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    });
  }
]);

mainControllers.controller('EditCategoriesCtrl', [
  "$scope",
  "$http",
  "$routeParams",
  "$location",
  "Flash",
  'getToken',
  function EditCategoriesCtrl($scope, $http, $routeParams, $location, Flash, getToken) {
    console.log('EditCategoriesCtrl');

    let categoryId = $routeParams.id;
    $scope.name = '';
    $scope.btnVal = 'Update';

    $http({
      url: `/api/categories/${categoryId}`,
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + getToken()
      }
    })
    .then(function(res) {
      console.log(res);
      $scope.name = res.data.name;
    }, 
    function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should logint`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    });

    $scope.submit = function() {
      var postData = {
        name: $scope.name
      };
      $http({
        url: `/api/categories/${categoryId}`,
        method: "PUT",
        data: postData,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(function(res) {
        console.log(res);
        window.history.back();
        Flash.create('success', `Success updated to category <strong>${postData.name}!</strong>`, 10000);
      }, 
      function(err) {
        let error = err.data.error;
        if (!error && err.status == 401) {
          error = `<strong>${err.data}!</strong> You should login inorder to submit`;
        }
        Flash.create('danger', error, 10000);
        console.log(err);
      });
    }
  }
]);


// Problem
mainControllers.controller('ProblemCtrl', [
  "$scope",
  "$http",
  "$location",
  "Flash",
  'getToken',
  function ProblemCtrl($scope, $http, $location, Flash, getToken) {
    console.log('ProblemCtrl');
    
    // Fetch problems
    $scope.problems = [];
    $scope.filteredProblems = [];
    $scope.categories = [];
    $scope.difficulty = 'all';
    $scope.category = 'all';
    $scope.search = '';

    $http({
      url: '/api/problems',
      method: "GET"
    })
    .then(res => {
      $scope.problems = res.data;
      $scope.filteredProblems = res.data;
      console.log($scope.filteredProblems);
    })
    .catch(err => {
      console.log(err);
    });

    $http({
      url: '/api/categories',
      method: "GET"
    })
    .then(res => {
      let data = res.data.map(c => c.name);
      let catgSet = new Set([...$scope.categories, ...data]);
      $scope.categories = Array.from(catgSet);
      console.log($scope.categories);
    })
    .catch(err => {
      console.log(err);
    });

    $scope.categoryCards = [
      {img: "/images/coffee.svg", title: "All", name: 'all'},
      {img: "/images/folder.svg", title: "Data Structures", name: "data-structures"},
      {img: "/images/graphs.svg", title: "Advanced Search Techniques", name: "advanced-search-techniques"},
      {img: "/images/algorithm.svg", title: "Divide and Conquer", name: "divide-and-conquer"},
      {img: "/images/dp.svg", title: "Dynamic Programming", name: "dynamic-programming"},
      {img: "/images/chess-pieces.svg", title: "Game Theory", name: "game-theory"},
      {img: "/images/neural.svg", title: "Graph Theory", name: "graph-theory"}
    ];

    $scope.applyFilter = function() {
      let filP = $scope.problems;
      if ($scope.difficulty !== 'all')
        filP = filP.filter(p => p.difficulty === $scope.difficulty);
      if ($scope.category !== 'all')
        filP = filP.filter(p => {
          let selCat = $scope.category;
          return p.category.reduce((val, data) => data.name === selCat || val, false);
        });
      $scope.filteredProblems = filP;
    };

    $scope.applySearch = function() {
      let filP = $scope.problems;
      filP = filP.filter(p => p.name.toLowerCase().startsWith($scope.search.toLowerCase()))
      $scope.filteredProblems = filP;
    };

    $scope.categories = $scope.categoryCards.map(c => c.name);
    $scope.getCategory = function(categoryName) {
      $scope.category = categoryName;
      $scope.applyFilter();
    };

    $scope.getCategoryString = function(categories) {
      return categories.map(c => c.name).join(', ');
    };
  }
]);

mainControllers.controller('SubmitProblemCtrl', [
  "$scope",
  "$http",
  "$location",
  "$routeParams",
  "Flash",
  'getToken',
  'checkCreds',
  'getUserId',
  function SubmitProblemCtrl($scope, $http, $location, $routeParams, Flash, getToken, checkCreds, getUserId) {
    console.log('SubmitProblemCtrl');
    $scope.problem = {};
    $scope.editorial = '';
    $scope.submissions = [];
    $scope.userCode = 'console.log("Hello, World");';
    $scope.bounds = '';
    $scope.editorCode = '';
    $scope.selectedLanguange = 'nodejs';
    $scope.problemId = $routeParams.id;
    $scope.changeSubTab = false;

    var md = window.markdownit();

    // Problem
    $http({
      url: `/api/problems/${$scope.problemId}`,
      method: "GET"
    })
    .then(function(res) {
      $scope.problem = res.data;
      $scope.problem.description = md.render(res.data.description);
      $scope.problem.bounds = md.render(res.data.bounds);
      // console.log(res.data);
    },
    function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should login inorder to submit`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    });

    console.log(getUserId());

    $http({
      url: `/api/editorials/problem/${$scope.problemId}`,
      method: "GET"
    })
    .then(function(res) {
      var da = res.data;
      da.explaination = md.render(da.explaination);
      $scope.editorial = da;
      // console.log(da);
      // $scope.editorial.explaination = md.render($scope.editorial.explaination);
      // console.log(res.data);
    },
    function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should login inorder to submit`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    });

    $http({
      url: `/api/submissions/problem/${$scope.problemId}/user/${getUserId()}`,
      method: "GET"
    })
    .then(function(res) {
      $scope.submissions = res.data;
    },
    function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should login inorder to submit`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    })

    $scope.submit = function() {
      if (!checkCreds()) {
        Flash.create('danger', "You need to be logged in to submit", 10000);
        return false
      }
      // console.log($scope.codeForm.userCode);
      // console.log($scope.userCode);
      // console.log($scope.selectedLanguange);
      $scope.changeSubTab = true;
      let postData = {
        problemId: $scope.problem._id,
        code: $scope.userCode,
        language: $scope.selectedLanguange,
        testcases: $scope.problem.testCases
      }
      $('#subTab').click();
      
      $http({
        url: '/api/submissions',
        method: "POST",
        data: postData,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(function(res) {
        $scope.submissions = [res.data, ...$scope.submissions]
        // Flash.create('danger', error, 10000);
        if (res.data.result) {
          Flash.create('success', 'Accepted', 10000);
        } else {
          Flash.create('danger', 'Not Accepted', 10000);
        }
        console.log(res.data);
      },
      function(err) {
        let error = err.data.error;
        if (!error && err.status == 401) {
          error = `<strong>${err.data}!</strong> You should login inorder to submit`;
        }
        Flash.create('danger', error, 10000);
        console.log(err);
      });
      
    };
  }
]);

mainControllers.controller('CreateProblemCtrl', [
  "$scope",
  "$http",
  "$location",
  "Flash",
  'getToken',
  function CreateProblemCtrl($scope, $http, $location, Flash, getToken) {
    console.log('CreateProblemCtrl');
    $scope.handleRegex = '([a-z0-9\-]+)';
    $scope.difficulty = 'Easy';

    $scope.categories = [];
    $http({
      url: '/api/categories',
      method: "GET"
    })
    .then(function(res) {
      console.log(res);
      $scope.categories = res.data
    }, 
    function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should logint`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    });

    $scope.sampleTestCases = [{id: 1,input:"", output: "", explaination: ""}];
    $scope.sampleTCindex = $scope.sampleTestCases.length;
    $scope.addNewSampleTestCase = function() {
      var newItemNo = ++$scope.sampleTCindex; 
      $scope.sampleTestCases.push({id:newItemNo, input:"", output: "", explaination: ""});
    };
    $scope.removeSampleTestCase = function(id) {
      if($scope.sampleTestCases.length<=1){
        alert("input cannot be less than 1");
        return;
      }
      var sampleTCindex = -1;
      var comArr = $scope.sampleTestCases;
      for( var i = 0; i < comArr.length; i++ ) {
        if(comArr[i].id === id) {
          sampleTCindex = i;
          break;
        }
      }
      if(sampleTCindex === -1) {
        alert( "Something gone wrong" );
      }
      $scope.sampleTestCases.splice(sampleTCindex, 1);
    };

    $scope.testCases = [{id: 1,input:"", output: ""}];
    $scope.TCindex = $scope.testCases.length;
    $scope.addTestCase = function() {
      var newItemNo = ++$scope.TCindex; 
      $scope.testCases.push({id:newItemNo, input:"", output: ""});
    };
    $scope.removeTestCase = function(id) {
      if($scope.testCases.length<=1){
        alert("input cannot be less than 1");
        return;
      }
      var TCindex = -1;
      var comArr = $scope.testCases;
      for( var i = 0; i < comArr.length; i++ ) {
        if(comArr[i].id === id) {
          TCindex = i;
          break;
        }
      }
      if(TCindex === -1) {
        alert( "Something gone wrong" );
      }
      $scope.testCases.splice(TCindex, 1);
    };

    $scope.submit = function() {
      var postData = {
        name: $scope.name,
        handle: $scope.handle,
        description: $scope.description,
        category: $scope.category,
        difficulty: $scope.difficulty,
        timeLimit: $scope.timeLimit,
        memoryLimit: $scope.memoryLimit,
        inputExplaination: $scope.inputExplaination,
        outputExplaination: $scope.outputExplaination,
        bounds: $scope.bounds,
        sampleTestCases: $scope.sampleTestCases,
        testCases: $scope.testCases
      }
      const sampleTc = $scope.sampleTestCases.map((tc) => { return {input: tc.input, output: tc.output, explaination: tc.explaination }})
      const finalTestCases = $scope.testCases.map((tc) => { return {input: tc.input, output: tc.output }})
      postData.sampleTestCases = sampleTc;
      postData.testCases = finalTestCases
      $http({
        url: '/api/problems',
        method: "POST",
        data: postData,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(function(res) {
        console.log(res);
        $location.path("/problems");
        Flash.create('success', `Success created problem <strong>${postData.name}!</strong>`, 10000);
      }, 
      function(err) {
        let error = err.data.error;
        if (!error && err.status == 401) {
          error = `<strong>${err.data}!</strong> You should login inorder to submit`;
        }
        Flash.create('danger', error, 10000);
        console.log(err);
      });      
    }
  }
]);


mainControllers.controller('ViewSubmissionCtrl', [
  "$scope",
  "$routeParams",
  "$http",
  "$location",
  "Flash",
  'getToken',
  function ViewSubmissionCtrl($scope, $routeParams, $http, $location, Flash, getToken) {
    $scope.submission = '';
    $scope.sId = $routeParams.id;

    $http({
      url: `/api/submissions/${$scope.sId}`,
      method: 'GET'
    })
    .then(function (res) {
      console.log(res.data);
      $scope.submission = res.data;
    }, function(err) {
      let error = err.data.error;
      if (!error && err.status == 401) {
        error = `<strong>${err.data}!</strong> You should login inorder to submit`;
      }
      Flash.create('danger', error, 10000);
      console.log(err);
    })
  }
]);

// Editorial
mainControllers.controller('CreateEditorialCtrl', [
  "$scope",
  "$routeParams",
  "$http",
  "$location",
  "Flash",
  'getToken',
  function CreateEditorialCtrl($scope, $routeParams, $http, $location, Flash, getToken) {
    console.log('CreateEditorialCtrl');
    $scope.problems = [];
    $scope.problemId = '';
    $scope.code = '';
    $scope.explaination = '';

    $http({
      url: '/api/problems',
      method: "GET"
    })
    .then(res => {
      $scope.problems = res.data;
      if ($scope.problems.length != 0) {
        $scope.problemId = $scope.problems[0]._id;
      }
    })
    .catch(err => {
      console.log(err);
    });

    $scope.submit = function() {
      // console.log($scope.problemId);
      // console.log($scope.code);
      // console.log($scope.explaination);

      let postData = {
        problem: $scope.problemId,
        code: $scope.code,
        explaination: $scope.explaination
      };
      $http({
        url: '/api/editorials',
        method: "POST",
        data: postData,
        headers: {
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(function(res) {
        console.log(res);
        $location.path("/");
        Flash.create('success', `Success created editorial!`, 10000);
      }, 
      function(err) {
        let error = err.data.error;
        if (!error && err.status == 401) {
          error = `<strong>${err.data}!</strong> You should login inorder to submit`;
        }
        Flash.create('danger', error, 10000);
        console.log(err);
      });  
    }
  }
]);
