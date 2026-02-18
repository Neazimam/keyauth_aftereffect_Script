

var appName = "Your API";
var ownerId = "Your API";
var appVer = "Your API";

// --- CORE LOGIC: HARDWARE ID ---
function getHWID() {
    try {
        var cmd = 'wmic csproduct get uuid';
        var output = system.callSystem(cmd);
        var lines = output.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].replace(/\s+/g, "");
            if (line !== "" && line.toUpperCase().indexOf("UUID") === -1) {
                return line;
            }
        }
    } catch (e) { /* Fallback */ }
    return "unknown_hwid";
}

// --- CORE LOGIC: KEYAUTH PROTOCOL ---
function performKeyAuth(username, password, win) {
    var userHWID = getHWID();

    // 1. INIT SESSION
    var initCmd = 'curl -s -X POST "https://keyauth.win/api/1.2/" ' +
                  '-d "type=init" -d "name=' + appName + '" ' +
                  '-d "ownerid=' + ownerId + '" -d "version=' + appVer + '"';
    var initRes = system.callSystem(initCmd);
    
    var sessionid = "";
    if (initRes.indexOf('"sessionid":"') > -1) {
        sessionid = initRes.split('"sessionid":"')[1].split('"')[0];
    }

    if (sessionid === "") return false;

    // 2. LOGIN REQUEST
    var loginCmd = 'curl -s -X POST "https://keyauth.win/api/1.2/" ' +
                   '-d "type=login" -d "username=' + username + '" ' +
                   '-d "pass=' + password + '" -d "hwid=' + userHWID + '" ' +
                   '-d "sessionid=' + sessionid + '" -d "name=' + appName + '" ' +
                   '-d "ownerid=' + ownerId + '"';
    var loginRes = system.callSystem(loginCmd);

    return (loginRes.indexOf('"success":true') > -1);
}

// --- UI: LOGIN WINDOW ---
function runLogin() {
    var loginWin = new Window("palette", "Dummy Script", undefined);
    loginWin.orientation = "column";
    loginWin.spacing = 15;
    loginWin.margins = 30;

    // Styling the Title
    var title = loginWin.add("statictext", undefined, "Dummy Script 2026");
    title.graphics.font = ScriptUI.newFont("Tahoma", "Bold", 20);

    var group = loginWin.add("group");
    group.orientation = "column";
    group.alignChildren = ["left", "center"];
    group.spacing = 5;

    group.add("statictext", undefined, "Username:");
    var u = group.add("edittext", [0, 0, 200, 25], "");
    
    group.add("statictext", undefined, "Password:");
    var p = group.add("edittext", [0, 0, 200, 25], "", {passwordCharacter: "*"});

    var loginBtn = loginWin.add("button", [0, 0, 200, 40], "LOGIN");
    
    // Animation Element
    var progBar = loginWin.add("progressbar", [0, 0, 200, 8], 0, 100);
    progBar.visible = false;

    loginBtn.onClick = function() {
        if (u.text === "" || p.text === "") {
            alert("Please enter credentials.");
            return;
        }

        // Elegant Animation Start
        loginBtn.enabled = false;
        loginBtn.text = "CONNECTING...";
        progBar.visible = true;
        
        // Simulated smooth ramp up
        for (var i = 0; i < 35; i++) {
            progBar.value = i;
            loginWin.update();
        }

        if (performKeyAuth(u.text, p.text)) {
            // Finish Animation
            for (var j = 36; j <= 100; j++) {
                progBar.value = j;
                if (j === 70) loginBtn.text = "VERIFIED";
                loginWin.update();
            }
            $.sleep(400); 
            loginWin.close();
            showPluginUI(u.text);
        } else {
            // Reset UI on failure
            progBar.visible = false;
            loginBtn.enabled = true;
            loginBtn.text = "LOGIN";
            alert("Invalid Login or HWID error.");
        }
    };

    loginWin.center();
    loginWin.show();
}

// --- UI: DUMMY PLUGIN PAGE ---
function showPluginUI(user) {
    var pluginWin = new Window("palette", "Dummy Script", undefined);
    pluginWin.orientation = "column";
    pluginWin.alignChildren = ["fill", "top"];
    pluginWin.spacing = 15;
    pluginWin.margins = 25;

    var welcome = pluginWin.add("statictext", undefined, "Welcome, " + user.toUpperCase());
    welcome.graphics.font = ScriptUI.newFont("Tahoma", "Bold", 14);
    
    pluginWin.add("statictext", undefined, "Status: Premium License Active");
    
    var panel = pluginWin.add("panel", undefined, "Example");
    panel.orientation = "column";
    panel.margins = 15;
    panel.spacing = 10;

    var btnBase = panel.add("button", undefined, "Example 1");
    var btnRS = panel.add("button", undefined, "Example 2");
    var btnReset = panel.add("button", undefined, "Example 3");

    btnBase.onClick = function() { alert("Done"); };
    btnRS.onClick = function() { alert("Done"); };
    btnReset.onClick = function() { alert("Done"); };

    var logoutBtn = pluginWin.add("button", undefined, "LOGOUT");
    logoutBtn.onClick = function() {
        pluginWin.close();
        runLogin();
    };

    pluginWin.center();
    pluginWin.show();
}

// Start the application
runLogin();
