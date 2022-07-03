export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export type Recursive<T> = {
    [P in keyof T]: RecursivePartial<T[P]>;
};
