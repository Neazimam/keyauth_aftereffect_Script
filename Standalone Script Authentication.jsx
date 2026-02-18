var appName = "Your credentials";
var ownerId = "your Credentials";
var appVer = "your credentials";

// ... (getHWID and performKeyAuth functions remain the same as before) ...
//Authentication initialization
function main() {
    var loginWin = new Window("palette", "Dummy Script", undefined);
    loginWin.orientation = "column";
    loginWin.spacing = 15;
    loginWin.margins = 25;

    // Header
    var title = loginWin.add("statictext", undefined, "Dummy Script Concept");
    title.graphics.font = ScriptUI.newFont("Tahoma", "Bold", 18);

    // Inputs
    var inputGroup = loginWin.add("group");
    inputGroup.orientation = "column";
    inputGroup.alignChildren = ["left", "center"];
    
    inputGroup.add("statictext", undefined, "Username");
    var u = inputGroup.add("edittext", [0, 0, 180, 25], "");
    
    inputGroup.add("statictext", undefined, "Password");
    var p = inputGroup.add("edittext", [0, 0, 180, 25], "", {passwordCharacter: "*"});

    // Animated Elements
    var loginBtn = loginWin.add("button", [0, 0, 180, 35], "LOGIN");
    
    // Hidden progress bar that appears on click
    var progBar = loginWin.add("progressbar", [0, 0, 180, 10], 0, 100);
    progBar.visible = false;

    var statusMsg = loginWin.add("statictext", undefined, "");
    statusMsg.graphics.foregroundColor = statusMsg.graphics.newPen(loginWin.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);

    loginBtn.onClick = function() {
        // --- START ANIMATION ---
        loginBtn.enabled = false;
        loginBtn.text = "AUTHENTICATING...";
        progBar.visible = true;
        
        // Fake "smooth" loading start
        for (var i = 0; i <= 30; i++) {
            progBar.value = i;
            loginWin.update(); // Forces the UI to refresh
        }

        // Perform actual Auth
        if (performKeyAuth(u.text, p.text)) {
            // Success "Animation"
            for (var i = 31; i <= 100; i++) {
                progBar.value = i;
                if(i == 60) loginBtn.text = "ACCESS GRANTED";
                loginWin.update();
            }
            
            $.sleep(500); // Small pause for elegance
            loginWin.close();
            showPluginUI(u.text);
        } else {
            // Reset on failure
            progBar.visible = false;
            loginBtn.enabled = true;
            loginBtn.text = "LOGIN";
            alert("Authentication Failed.");
        }
    };

    loginWin.center();
    loginWin.show();
}
//your main plugin code here
// --- DUMMY PLUGIN UI ---
function showPluginUI(user) {
    var pluginWin = new Window("palette", "Dummy Authentication", undefined);
    pluginWin.orientation = "column";
    pluginWin.alignChildren = ["fill", "top"];
    pluginWin.spacing = 15;
    pluginWin.margins = 20;

    pluginWin.add("statictext", undefined, "User: " + user.toUpperCase());
    pluginWin.add("statictext", undefined, "Status: Authenticated (Premium)");
    
    var divider = pluginWin.add("panel", [0,0,200,2]); // Visual line
    
    var btn1 = pluginWin.add("button", undefined, "Dummy Button");
    var btn2 = pluginWin.add("button", undefined, "Dummy Button 1");
    
    btn1.onClick = function() { alert("Executing"); };
    btn2.onClick = function() { alert("Executing 1"); };

    pluginWin.center();
    pluginWin.show();
}

main();