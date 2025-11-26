import Web3Wallet from '@/components/web3/Web3Wallet';

export default function Web3Page() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Web3 & Blockchain</h1>
        <p className="text-gray-600 mt-2">
          Децентрализованные возможности FOCUS: NFT achievements, токены и блокчейн интеграция
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Web3Wallet />
        </div>

        <div className="space-y-6">
          {/* NFT Gallery */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">NFT Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <h4 className="font-medium">First Steps</h4>
                <p className="text-sm text-gray-600">Common</p>
              </div>
              <div className="border rounded-lg p-4 text-center opacity-50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="font-medium">Scholar</h4>
                <p className="text-sm text-gray-600">Rare</p>
              </div>
            </div>
          </div>

          {/* Token Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">FOCUS Token</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Ваш баланс:</span>
                <span className="font-mono">0 FOCUS</span>
              </div>
              <div className="flex justify-between">
                <span>Общая эмиссия:</span>
                <span className="font-mono">1,000,000 FOCUS</span>
              </div>
              <div className="flex justify-between">
                <span>Цена:</span>
                <span className="font-mono">$0.10</span>
              </div>
            </div>
          </div>

          {/* Blockchain Features */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Возможности</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                NFT achievements за достижения
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Токены за активность
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                DAO голосование (скоро)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                DeFi интеграция (скоро)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}