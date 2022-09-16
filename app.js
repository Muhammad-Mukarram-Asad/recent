// showing login screen if user already have account
var showLogin = document.getElementById("show-login-sc");
var showSignup = document.getElementById("show-signup-sc");
var loginScreen = document.getElementById("login-screen");
var signupScreen = document.getElementById("signup-screen");

showLogin.addEventListener("click", function () {
    signupScreen.style.display = "none";
    loginScreen.style.display = "block";
})

showSignup.addEventListener("click", function () {
    signupScreen.style.display = "block";
    loginScreen.style.display = "none";
})

// puuting loged in user in active user

var activeUser;
var allUser;

// loading localStorage on page load to get the data 

function loadLocalStorage() {
    allUser = JSON.parse(localStorage.getItem("data"));
    if (allUser == null) {
        allUser = [];
    }
    activeUser = null;
}

// making construction function to generate object of the registrating user

function UserObj(name, imgURL, email, password) {
    this.name = name;
    this.imgURL = imgURL;
    this.email = email;
    this.password = password;
    this.friends = [];
    this.posts = [];

}


// loging out user 


var logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", function(){
    location.reload();
})

// registering user by getting data

var registerBtn = document.getElementById("register-btn");

registerBtn.addEventListener("click", function () {

    var savedUser = allUser;

    //getting the value from registration form

    var name = document.getElementById("fullName");
    var imgURL = document.getElementById("imgURL");
    var userEmail = document.getElementById("userEmail");
    var userPsw = document.getElementById("userPsw");

    if (name.value != "" && imgURL.value != "" && userEmail.value != "" && userPsw.value != "") {

        var appUser = new UserObj(name.value, imgURL.value, userEmail.value, userPsw.value);

        var isFound = false;

        // checking this email exist or not 

        for (var i = 0; i < savedUser.length; i++) {
            if (savedUser[i].email == appUser.email) {
                isFound = true;
                break;
            }
        }
        if (isFound == false) {
            savedUser.push(appUser);
            localStorage.setItem("data", JSON.stringify(savedUser));
            signupScreen.style.display = "none";
            loginScreen.style.display = "block";
        } else {
            alert("This Email Already Exists");
        }

        // removing value from the input fields

        name.value = "";
        imgURL.value = "";
        userEmail.value = "";
        userPsw.value = "";

    } else {
        alert("Please Fill the Form ");
    }
});

// login user by matching the email and password

var loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", function () {

    var localData = allUser;
    var regisEmail = document.getElementById("regis-email");
    var regisPsw = document.getElementById("regis-psw");
    var userPanel = document.getElementById("user-panel");

    // checking login detail correct or not 

    var isFound = false;

    if (localData != null) {
        for (var i = 0; i < localData.length; i++) {
            if (regisEmail.value == localData[i].email && regisPsw.value == localData[i].password) {
                userPanel.style.display = "block";
                signupScreen.style.display = "none";
                loginScreen.style.display = "none";
                isFound = true;
                activeUser = localData[i];
                break;
            }
        }
    }

    if (isFound == false) {
        alert("Enter Correct Information OR Register First");
        return;
    }

    regisEmail.value = "";
    regisPsw.value = "";

    // showing logged user and total useres by calling function

    showLogedProfile();

    showTotalUsers();

    showFriends();

    showPosts();

});

// showing user profile on the user scree

function showLogedProfile() {
    var profileSec = document.getElementById("profile-sec");
    var profileSecHtml = ` <div class="col-lg-6 d-flex align-items-center"id="profile-card">
                            <img src="${activeUser.imgURL}" alt="" class="img-fluid rounded-circle mr-2" width="140px" height="140px">
                            <h2>${activeUser.name}</h2>
                           </div>`;

    profileSec.innerHTML = profileSecHtml;
}

function showTotalUsers() {

    var totalUser = allUser;
    var totalUserScreen = document.getElementById("totalUser");

    for (var i = 0; i < totalUser.length; i++) {

        // removing the active user from all users list 

        if (activeUser.email == totalUser[i].email) {
            continue;
        }

        var totalUsersHtml = `<div class="card p-3 m-2 shadow-sm">
                                <div class="myFriend-img d-flex align-items-center">
                                    <div class="friedImg mr-3">
                                        <img src="${totalUser[i].imgURL}" alt="" class="img-fluid rounded-circle" width="70px" height="70px">
                                    </div>
                                    <div class="myFrient-title">
                                        <h6 class="d-none">${totalUser[i].email}</h6>
                                        <h4>${totalUser[i].name}</h4>
                                        <button class="btn btn-dark" onclick="addFriend('${totalUser[i].email}')">Add Friend</button>
                                    </div>
                                </div>
                            </div>`;

        totalUserScreen.innerHTML += totalUsersHtml;

    }
}


// adding friends

function addFriend(friendEmail) {


    // getting the data from localStorage 
    var savedUser = allUser;

    isAllreadyFriend = false;
    var activeObject=activeUser;

    // checking the friend list is allready this friend added or not 

    for (var i = 0; i < activeObject.friends.length; i++) {
        if (activeObject.friends[i] == friendEmail) {
            isAllreadyFriend = true;
            break;
        }
    }
    
    // if friend not exist add this email to the friend list

    if (isAllreadyFriend == false) {
        for (var i = 0; i < savedUser.length; i++) {
            if (activeObject.email == savedUser[i].email) {
                savedUser[i].friends.push(friendEmail);
                break;
            }
        }
    }


    // if this email is already exist in the friend list showing error

    if (isAllreadyFriend == true) {
        alert("Already Exists In Friend List");
    }

    localStorage.setItem("data", JSON.stringify(savedUser));

    // showing total friend after add click on add friend by using bottom function calling

    showFriends();

}

// showing friends of loged in user

function showFriends() {

    var localData = allUser;
    var friendScreen = document.getElementById("activeUserFriend");
    friendScreen.innerHTML = "";
    for (var i = 0; i < localData.length; i++) {

        if (localData[i].email == activeUser.email) {
            continue;
        }

        for (var j = 0; j < activeUser.friends.length + 1; j++) {


            if (localData[i].email == activeUser.friends[j]) {
                var friendCard = `  <div class="card p-3 m-2 shadow-sm">
                                        <div class="myFriend-img d-flex align-items-center">
                                            <div class="friedImg mr-3">
                                                <img src="${localData[i].imgURL}" alt="" class="img-fluid rounded-circle" width="70px">
                                            </div>
                                            <div class="myFrient-title">
                                                <h4>${localData[i].name}</h4>
                                                <button class="btn btn-dark" onclick="removeFriend('${localData[i].email}')">Unfriend</button>
                                                <button class="btn btn-dark">Message</button>
                                            </div>
                                        </div>
                                    </div>`;

                friendScreen.innerHTML += friendCard;
            }
        }
    }
}

function removeFriend(friendEmail) {

    // getting the data from localStorage 

    var savedUser = allUser;

    // getting email of the friend which have to include in friends

    isAllreadyFriend = false;
    var activeObject=activeUser;

    for (var i = 0; i < activeObject.friends.length; i++) {
        if (activeObject.friends[i] == friendEmail) {
            isAllreadyFriend = true;
            activeObject.friends.splice(i, 1);
            break;
        }
    }

    localStorage.setItem("data", JSON.stringify(savedUser));

    showFriends();

}

// add post function 

var addPostBtn = document.getElementById("post-btn");

addPostBtn.addEventListener("click", function(){

    var postText = document.getElementById("post-text");
    var localData = allUser;
    if(postText.value == ""){
        alert("Please Enter Something");
    }else{

        // getting the post and pushing the post in the active use posts array 

        for(var i = 0; i < localData.length; i++){
            if(activeUser.email == localData[i].email){
                localData[i].posts.push(postText.value);
                break;
            }
        }
    }

    localStorage.setItem("data", JSON.stringify(localData));

    postText.value = "";

    showPosts();
});

function showPosts(){

    // showing post all posts from all the users 

    var localData = allUser;
    var postSection = document.getElementById("post-section");
    postSection.innerHTML = "";
    var date = new Date();
    var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();

    for(var i = 0; i < localData.length; i++){
        for(var j = 0; j < localData[i].posts.length; j++){
            var PostCard = ` <div class="col-lg-4">
                                <div class="card p-4 m-2 shadow">
                                    <div class="h5">
                                        <p class="left">${localData[i].name} </p>
                                    </div>
                                    <div id="post-content">
                                        <p>${localData[i].posts[j]}</p>
                                    </div>
                                </div>
                            </div>`;

                            postSection.innerHTML += PostCard;

        }
    }
}

// warn user if you refersh all data will be lost 

window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
};