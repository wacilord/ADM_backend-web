var passwordstrength = {
    checkStrong(val) {

        // 密码规则
        // 密码需由数字、字母、符号任意两者组成

        var modes = 0;
        if (val.length < 6) return 0;
        if (/\W/.test(val)) return 777; //特殊字符
        // if (/\W/.test(val)) modes++; //特殊字符
        if (/\d/.test(val)) modes++; //数字
        // if (/[a-z]/.test(val)) modes++; //小写
        // if (/[A-Z]/.test(val)) modes++; //大写  
        if (/[a-z]/.test(val) || /[A-Z]/.test(val)) modes++;
        return modes;
    },
    intFormat(val) {
        var f = parseFloat(val);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(val * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }

        s = s.toString()
            .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
                return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
            });
        return s;
    }
}

export { passwordstrength };
