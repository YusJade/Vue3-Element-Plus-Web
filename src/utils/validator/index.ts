export const validateEmail = (value: string): string => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(value)) {
    return '请输入有效的邮箱地址';
  }
  return '';
};

/**
 * 用户名只能包含字母（大小写）、数字和下划线（_），用户名长度在 3 到 20 个字符之间。
 * @param value 
 * @returns 
 */
export const validateUsername = (value: string): string => {
  const startsWithLetter = /^[a-zA-Z]/.test(value);
  const containsValidChars = /^[a-zA-Z0-9_]*$/.test(value);
  const validLength = /^.{3,20}$/.test(value);

  if (!startsWithLetter) {
    return '只能以字母开头';
  } else if (!containsValidChars) {
    return '只能包含字母、数字和下划线';
  } else if (!validLength) {
    return '长度只能在 3 到 20 个字符之间';
  } else {
    return '';
  }
};

export const validatePhone = (value: string): string => {
  // 匹配中国大陆手机号
  const phonePattern = /^1[3-9]\d{9}$/;
  if (!phonePattern.test(value)) {
    return '请输入有效的电话号码';
  }
  return '';
};

/**
 * 密码长度在 8 到 20 个字符之间，必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符
 * @param value 
 * @returns 
 */
export const validatePassword = (value: string): string => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!passwordPattern.test(value)) {
    return '请输入有效的密码';
  }
  return '';
};
