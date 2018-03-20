import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

  //--------------------------------------------
  // 入力チェック（必須項目）
  //--------------------------------------------
  inputCheckNoEmpty(val :string): boolean {
	if (val ===undefined || val === null || val === "") {
		//エラー
		return false;
	}
	return true;
  }
  
  //--------------------------------------------
  // 入力チェック（半角英数字（小文字）のみ）
  //--------------------------------------------
  inputCheckAlphaNumericSmallCase(val :string): boolean {
    if(!this.inputCheckNoEmpty(val)) { 
    	return false;
    }
	if (val.match(/[^a-z0-9-]+/)) {
		//エラー
		return false;
	}
	return true;
  }

  //--------------------------------------------
  // 入力チェック（半角英数字のみ）
  //--------------------------------------------
  inputCheckAlphaNumeric(val :string): boolean {
    if(!this.inputCheckNoEmpty(val)) { 
    	return false;
    }
	if (val.match(/[^A-Za-z0-9]+/)) {
		//エラー
		return false;
	}
	return true;
  }

  //--------------------------------------------
  // 入力チェック（半角英数字（小文字）+ハイフンのみ）
  //--------------------------------------------
  inputCheckAlphaNumericWithHyphen(val :string): boolean {
    if(!this.inputCheckNoEmpty(val)) { 
    	return false;
    }
	if (val.match(/[^a-z0-9\-]+/)) {
		//エラー
		return false;
	}
	return true;
  }

  //--------------------------------------------
  // 入力チェック　半角英数字＋記号（!#$@()*,./_-~?）
  //--------------------------------------------
  inputCheckAlphaNumericWithSymbol(val :string): boolean {
    if(!this.inputCheckNoEmpty(val)) { 
    	return false;
    }
	if (val.match(/[^a-z0-9!_#~@$\?\/\,\.\(\)\*\-]+/)) {
		//エラー
		return false;
	}
	return true;
  }
  
  //--------------------------------------------
  // 入力チェック（email）
  //--------------------------------------------
  inputCheckEmail(val :string): boolean {
    if(!this.inputCheckNoEmpty(val)) { 
    	return false;
    }
    // see http://qiita.com/sakuro/items/1eaa307609ceaaf51123
    let emailRegexp_short = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // see https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
    let emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(val);
  }
}
