var continueSession;

$(document).ready(function() {
    // start session
    localStorage.setItem("session", "true");
    continueSession = false;
    
    window.onbeforeunload = function(e) {
        // end session if navigating away from ScrumBuddy
        if (!continueSession)
        {
            localStorage.setItem("session", "false");
        }
    };
    
    $(document).on("click", "#joinroom", function(data)
    {
        if (!nameIsEmpty())
        {
            setLocalName();
            continueSession = true;
            location.href = "./HTML/rooms.html";
        }
    });

    $(document).on("click", "#hostroom", function(data)
    {
        if (!nameIsEmpty())
        {
            setLocalName();
            continueSession = true;
            location.href = "./HTML/Host.html";
        }
    });
});

function nameIsEmpty()
{
    if(document.getElementById("usr").value == "")
    {
        alert("Please enter a name.");
        return true;
    }

    return false;
}

function setLocalName()
{
    localStorage.setItem("name", document.getElementById("usr").value);
}
