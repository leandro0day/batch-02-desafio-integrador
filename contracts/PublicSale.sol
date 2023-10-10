// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IUniSwapV2Router02} from "./Interfaces.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract PublicSale is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    IUniSwapV2Router02 router;
    IERC20Upgradeable public usdcToken; // Agrega el contrato del token USDC
    address public nftContractAddress; // Agrega la dirección del contrato de NFT en Polygon

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant EXECUTER_ROLE = keccak256("EXECUTER_ROLE");

    // 00 horas del 30 de septiembre del 2023 GMT
    uint256 constant startDate = 1696032000;

    // Maximo price NFT
    uint256 constant MAX_PRICE_NFT = 90_000 * 10 ** 18;

    struct NftPrice {
        uint256 minPrice; // Precio mínimo del NFT
        uint256 maxPrice; // Precio máximo del NFT
    }

    mapping(uint256 => NftPrice) public nftPrices;

    event PurchaseNftWithId(address account, uint256 id);

    function initialize(
        address _router,
        address _usdcToken,
        address _nftContract
    ) public initializer {
        __Pausable_init();
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        router = IUniSwapV2Router02(_router);
        usdcToken = IERC20Upgradeable(_usdcToken);
        nftContractAddress = _nftContract;

        // Establece los precios para cada ID de NFT según la tabla proporcionada
        for (uint256 i = 0; i < 200; i++) {
            if (i < 200) {
                nftPrices[i] = NftPrice(1000 * 10 ** 18, 1000 * 10 ** 18);
            } else if (i < 500) {
                nftPrices[i] = NftPrice(i * 20 * 10 ** 18, i * 20 * 10 ** 18);
            } else if (i < 700) {
                uint256 daysPassed = (block.timestamp - startDate) / 1 days;
                uint256 price = 10000 * 10 ** 18 + daysPassed * 2000 * 10 ** 18;
                if (price > MAX_PRICE_NFT) {
                    price = MAX_PRICE_NFT;
                }
                nftPrices[i] = NftPrice(price, price);
            }
        }
    }

    function getPriceForId(uint256 _id) public view returns (uint256) {
        require(_id >= 0 && _id <= 699, "ID fuera de rango");
        return nftPrices[_id].minPrice;
    }

    function purchaseWithTokens(uint256 _id) public {
        require(_id >= 0 && _id <= 699, "ID fuera de rango");
        uint256 price = nftPrices[_id].minPrice;
        require(price > 0, "ID de NFT no valido");
        emit PurchaseNftWithId(msg.sender, _id);
    }

    function purchaseWithUSDC(uint256 _id, uint256 _amountIn) external {
        // transfiere _amountIn de USDC a este contrato
        // llama a swapTokensForExactTokens: valor de retorno de este metodo es cuanto gastaste del token input
        // transfiere el excedente de USDC a msg.sender
        require(_id >= 0 && _id <= 699, "ID fuera de rango");
        uint256 minPrice = nftPrices[_id].minPrice;
        uint256 maxPrice = nftPrices[_id].maxPrice;
        require(minPrice > 0 && maxPrice > 0, "ID de NFT no vslido");
        require(
            _amountIn >= minPrice && _amountIn <= maxPrice,
            "Precio no valido"
        );

        // Realiza la compra del NFT con USDC
        emit PurchaseNftWithId(msg.sender, _id);
    }

    function purchaseWithEtherAndId(uint256 _id) public payable {
        require(_id >= 700 && _id <= 999, "ID fuera de rango");
        require(msg.value == 0.01 ether, "Se requieren 0.01 ether exactos");

        // Realiza la compra del NFT con USDC
        emit PurchaseNftWithId(msg.sender, _id);
    }

    function depositEthForARandomNft() public payable {}

    receive() external payable {
        depositEthForARandomNft();
    }

    ////////////////////////////////////////////////////////////////////////
    /////////                    Helper Methods                    /////////
    ////////////////////////////////////////////////////////////////////////

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
