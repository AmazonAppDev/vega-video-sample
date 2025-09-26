// testHepler.ts
export const asMock = <T extends any = any, Y extends any[] = any[]>(
  obj: any,
): jest.Mock<T, Y> => obj as jest.Mock<T, Y>;
