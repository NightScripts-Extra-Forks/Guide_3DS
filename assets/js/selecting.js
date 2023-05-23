/*
    Copyright (C) 2023 Gruetzig
    Copyright (C) 2023 Nintendo Homebrew

    SPDX-License-Identifier: MIT
*/

// Soundhax
// 1.0-11.3, all regions, all consoles
function can_soundhax(major, minor, native, region, model) {
    if(major <= 10) return true;
    else if(major == 11 && minor <= 3) return true;
    return false;
}

// SSLoth
// U/E/J has different version table than KOR
// KOR/CHN/TWN Old 3DS browser (spider) 1.7630 (v10240, shipped with 11.1~11.8) isn't supported by browserhax
// CHN/TWN isn't validated for now as those cannot exploit atm
function can_ssloth(major, minor, native, region, model) {
    if(major == 11) {
        if(["U", "E", "J"].includes(region)) {
            if
                (
                (minor == 4 && native == 37) ||
                (minor == 5 && native == 38) ||
                (minor == 6 && native == 39) ||
                (minor == 7 && native == 40) ||
                (minor == 8 && native == 41) ||
                (minor == 9 && native == 42) ||
                (minor == 10 && native == 43) ||
                (minor == 11 && native == 43) ||
                (minor == 12 && native == 44) ||
                (minor == 13 && native == 45)
                ) {
                    return true;
            }
        } else if (region == "K") {
            if
                (
                (!model && minor == 4 && native == 33) ||
                (!model && minor == 5 && native == 34) ||
                (!model && minor == 6 && native == 35) ||
                (!model && minor == 7 && native == 35) ||
                (!model && minor == 8 && native == 35) ||
                (minor == 9 && native == 36) ||
                (minor == 10 && native == 37) ||
                (minor == 12 && native == 38) ||
                (minor == 13 && native == 39)
                ) {
                    return true;
            }
        }
    }
    return false;
}

// safecerthax
// O3DS only, all regions
// Works on 1.0 to 11.14
// Soundhax and SSLoth should be validated before this
function can_safecerthax(major, minor, native, region, model) {
    if (model != 0) return false;
    if (major <= 10) return true;
    else if (major == 11 && minor <= 14) return true;
    return false;
}

// super-skaterhax
// EUR/JPN: 11.17 only, USA has no working otherapp on 11.17
// KOR: 11.16 only, KOR does not have 11.17
// CHN/TWN has no N3DS
function can_superskaterhax(major, minor, native, region, model) {
    if(model != 1) return false;
    if (major == 11) {
        if (["E", "J"].includes(region) && minor == 17)
            return true;
        else if(region == "K" && minor == 16)
            return true;
    }
    return false;
}

// Seedminer, U/E/J/K region
// only 11.16 can run Seedminer
function can_seedminer(major, minor, native, region, model) {
    return (["U", "E", "J", "K"].includes(region) && major == 11 && minor == 16);
}

// TWN needs a special seedminer
function can_seedminer_twn(major, minor, native, region, model) {
    return (region == "T" && major == 11 && minor == 16);
}

/*
    Redirects page based on input from user.
    Input:
        - System version
        - O3DS/N3DS

    General exploits are as follows:
    - 1.0 - 11.3
        - Soundhax, compatible in all regions, all models
    - 11.4 - 11.13 with matching NVer for each version:
        - SSLoth-Browser, doesn't work on cart-updated FW
    - O3DS & 11.4 - 11.14 & any cart-updated FW between said version:
        - safecerthax, compatible in all regions, O3DS only
        - This way O3DS still gets an easy way to install something if browser isn't functional
    - N3DS & 11.14 - 11.15 (EUR / JPN) 
        - Update and do 11.17 guide
    - O3DS & 11.15:
        - Not implemented in this guide
    - 11.16:
        - Seedminer
    - N3DS & 11.17 (EUR / JPN):
        - super-skaterhax (currently not working on USA)
    - O3DS & 11.17:
        - Unhackable
*/
function redirect() {
    var major = document.getElementById("major");
    var minor = document.getElementById("minor");
    var nver = document.getElementById("nver");
    var region = document.getElementById("region");
    var isN3DS = document.getElementById("new3DS").checked;
    var isO3DS = document.getElementById("old3DS").checked;
    document.getElementById("result_noneSelected").style.display = "none";
    document.getElementById("result_invalidVersion").style.display = "none";
    document.getElementById("result_methodUnavailable").style.display = "none";
    if ((!isN3DS) && (!isO3DS)) {
        document.getElementById("result_noneSelected").style.display = "block";
        return;
    }
    else if (major.value == 0) {
        document.getElementById("result_invalidVersion").style.display = "block";
        return;
    }

    // O3DS = 0
    // N3DS = 1
    var model = 0;
    if(isN3DS) model = 1;

    // Start validation
    if(can_soundhax(major.value. minor.value, nver.value, region.value, model))
        window.location.href = "installing-boot9strap-(soundhax)";
    else if(can_ssloth(major.value, minor.value, nver.value, region.value, model))
        window.location.href = "installing-boot9strap-(ssloth-browser)";
    else if(can_safecerthax(major.value, minor.value, nver.value, region.value, model))
        window.location.href = "installing-boot9strap-(safecerthax)";
    // check super-skaterhax before seedminer, as both run on certain 11.16
    else if(can_superskaterhax(major.value, minor.vlaue, nver.value, region.value, model))
        window.location.href = "homebrew-launcher-(super-skaterhax)";
    else if(can_seedminer(major.value, minor.value, nver.value, region.value, model))
        window.location.href = "seedminer";
    else if(can_seedminer_twn(major.value, minor.value, nver.value, region.value, model))
        window.location.href = "seedminer-(twn)";
    else
        document.getElementById("result_methodUnavailable").style.display = "block";
}
