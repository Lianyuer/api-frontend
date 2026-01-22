/**
 * 接口状态枚举
 */
export enum InterfaceInfoStatusEnum {
  /** 已下线 */
  OFFLINE = 0,

  /** 已发布 */
  ONLINE = 1,
}

/**
 * 获取接口状态对应的中文描述
 * @param status 状态值
 * @returns 中文描述
 */
export function getInterfaceInfoStatusText(
  status: InterfaceInfoStatusEnum
): string {
  switch (status) {
    case InterfaceInfoStatusEnum.OFFLINE:
      return "已下线";
    case InterfaceInfoStatusEnum.ONLINE:
      return "已发布";
    default:
      return "未知状态";
  }
}

/**
 * 获取接口状态选项列表，用于下拉选择器等场景
 * @returns 状态选项数组
 */
export function getInterfaceInfoStatusOptions(): Array<{
  label: string;
  value: InterfaceInfoStatusEnum;
}> {
  return [
    { label: "已下线", value: InterfaceInfoStatusEnum.OFFLINE },
    { label: "已发布", value: InterfaceInfoStatusEnum.ONLINE },
  ];
}

/**
 * 判断是否为有效的接口状态
 * @param status 状态值
 * @returns 是否有效
 */
export function isValidInterfaceInfoStatus(status: number): boolean {
  return Object.values(InterfaceInfoStatusEnum).includes(
    status as InterfaceInfoStatusEnum
  );
}

// 可选：创建反向映射，从数字获取枚举键名
export function getInterfaceInfoStatusKey(
  status: InterfaceInfoStatusEnum
): string | undefined {
  return InterfaceInfoStatusEnum[status];
}
