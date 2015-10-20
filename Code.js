var PAGETITLE = PropertiesService.getScriptProperties().getProperty('pageTitle');
var AUDITREPORTID = PropertiesService.getScriptProperties().getProperty('auditReportId');



function doGet() {
  return HtmlService
      .createTemplateFromFile('index')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle(PAGETITLE);
}



function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}



function renameFiles(){
  var test, auditSs, sheet, allFiles, targetFiles;
  
  auditSs = SpreadsheetApp.openById(AUDITREPORTID);
  sheet = auditSs.getSheets()[0];
  allFiles = NVSL.getRowsData(sheet);
  targetFiles = allFiles.filter(function(e){
    return e.date.split(" ")[0] == 'October' && e.date.split(" ")[1] == '19';
  });
  
  targetFiles.forEach(function(e){
    var currName = e.eventDescription.split(" to ")[1];
    var newName = e.eventDescription.split(" to ")[0].split("renamed ")[1];
    var files = DriveApp.getFilesByName(currName);
    while(files.hasNext()){
      var file = files.next();
      file.setName(newName);
    }
    return;
  });
  
  html = HtmlService.createTemplateFromFile('confirmation_page');
  html.fileCount = targetFiles.length;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}