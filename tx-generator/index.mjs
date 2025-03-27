import { ethers } from "ethers";
(async () => {
    const provider = new ethers.JsonRpcProvider('http://65.0.119.186:8547'); // Rollup RPC URL
    const signer = new ethers.Wallet('f46e7f0936b479bba879c9f764259d1e5838aa015232f0018a1c07214e491812', provider);

    const tx = await signer.sendTransaction({
        to: '0x171DBc0126F85fd1cB84f3b242756286A8F1E134',
        value: ethers.parseUnits('1', 'wei'),
        gasPrice: ethers.parseUnits('1', 'gwei'),
        gasLimit: 26000,
    });
    console.log(tx);
})();
