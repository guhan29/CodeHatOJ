const axios = require('axios');

  const cppCode = `
  #include<iostream>
  #include<vector>
  #include<algorithm>
  using namespace std;

  vector<int> dp;
      

  int robHouse(vector<int>& nums, int n) {
    if (n <= 0) {
        return 0;
    }
    if (dp[n - 1] != -1) {
        return dp[n - 1];
    }
    int selected = nums[n - 1] + robHouse(nums, n - 2);
    int notSelected = robHouse(nums, n - 1);
    return dp[n - 1] = max(selected, notSelected);
  }

  int rob(vector<int>& nums) {
          int n = nums.size();
          dp.resize(n, -1);
          return robHouse(nums, n);
      }

  int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
      cin >> nums[i];
    }
    cout << rob(nums) << endl;
    return 0;
  }`;

const input = `4
1 2 3 1
`;

const runCode =  function() {
    let postData = {
      lang: "CPP",
      source: cppCode,
      input: input,
      memory_limit: 243232,
      time_limit: 2,
    };
    let secret = {};
    secret['client-secret'] = "";
    axios.post('https://api.hackerearth.com/v4/partner/code-evaluation/submissions/', postData, {
      headers: secret
    })
    .then(res => {
      console.log(res);
      console.log();
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
      console.log();
      console.log(err.message);
    });
    
    
}


runCode();
