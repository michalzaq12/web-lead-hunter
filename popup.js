function parseLeadsToCsv(leads) {
  let data = '';
  for(const lead of leads) {
    data += (lead.email + ',"'  + lead.title + '",' + lead.name + '\n');
  }
  return data;
}



const DATA_KEY = 'leads';

function updateUI() {
  chrome.storage.local.get({[DATA_KEY]: []}, result => {
    const savedData = result[DATA_KEY];
    document.getElementById('leads').value = parseLeadsToCsv(savedData);
  })
}

document.getElementById('clear').addEventListener('click', () => {
  chrome.storage.local.set({[DATA_KEY]: []});
  updateUI();
})

updateUI()