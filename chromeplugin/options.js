// Saves options to chrome.storage
function save_options() {
  var affiliateCode = document.getElementById('affiliate_code').value;
  
  localStorage.saAffiliateCode = affiliateCode;
  localStorage.saUseAffiliateCode = affiliateCode != '' ? true : false;
  localStorage.saUseSmile = document.getElementById('use_smile').checked;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    document.getElementById('affiliate_code').value = localStorage.saAffiliateCode;
    document.getElementById('use_smile').checked = (localStorage.saUseSmile == "true");
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
