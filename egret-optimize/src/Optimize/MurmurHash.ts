module optimize {
    /**
     * MurmurHash
     * 加密型哈希函数，适用于一般的哈希检索操作
     */
    export class MurmurHash {
        public static readonly C1 = 0xcc9e2d51;
        public static readonly C2 = 0x1b873593;
        public static readonly VERIFICATION = 0xB0F57EE3;

        public static murmurHash_32(data: [], length: number = data.length, h1: number = 0x1337){
            let nblocks = length >> 2;
            let i = 0;
            for (let j = nblocks; j > 0; --j){
                let k1l = this.toInt64(data, 0);
                k1l *= this.C1;
            }
        }

        private static toInt64(value: [], startIndex: number){
            let lowBytes = (value[startIndex]) | (value[startIndex + 1] << 8) | (value[startIndex + 2] << 16) | (value[startIndex + 3] << 24);
            let highBytes = (value[startIndex + 4]) | (value[startIndex + 5] << 8) | (value[startIndex + 6] << 16) | (value[startIndex + 7] << 24);
            return (lowBytes | (highBytes << 32));
        }

        private static rotl32(x: number, r: number){
            return (x << r) | (x >> (32 - r));
        }    
    }
}