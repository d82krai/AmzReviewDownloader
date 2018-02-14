const injector = {
  CDN_STRING: 'https://code.jquery.com/jquery-latest.min.js',
  INJECTED: false,
};

const injector2 = {
  CDN_STRING: 'https://rawgit.com/SheetJS/js-xlsx/master/dist/xlsx.full.min.js',
  INJECTED: false,
};

const injector3 = {
  CDN_STRING: 'https://fastcdn.org/FileSaver.js/1.1.20151003/FileSaver.min.js',
  INJECTED: false,
};

function injectCDN() {
  if (injector.INJECTED) {
    return;
  }
  
  const element = document.createElement('script');
  element.src = injector.CDN_STRING;
  document.getElementsByTagName('head')[0].appendChild(element);
  injector.INJECTED = true;
  
}

function injectCDN2() {
  if (injector2.INJECTED) {
    return;
  }
  
  const element = document.createElement('script');
  element.src = injector2.CDN_STRING;
  document.getElementsByTagName('head')[0].appendChild(element);
  injector2.INJECTED = true;
  
}

function injectCDN3() {
  if (injector3.INJECTED) {
    return;
  }
  
  const element = document.createElement('script');
  element.src = injector3.CDN_STRING;
  document.getElementsByTagName('head')[0].appendChild(element);
  injector3.INJECTED = true;
}

injectCDN();
injectCDN2();
injectCDN3();
