import { Address, BigInt } from "@graphprotocol/graph-ts";

import {
    User,
    FakeGotchiCardContract,
    FakeGotchiCardToken,
    FakeGotchiCardBalance,
} from "../../generated/schema";

import { IERC1155 } from "../../generated/FAKEGotchisCardDiamond/IERC1155";

import { constants } from "@amxx/graphprotocol-utils";
import { getOrCreateUser } from "../utils/helpers/diamond";

export function replaceURI(uri: string, identifier: BigInt): string {
    return uri.replaceAll(
        "{id}",
        identifier
            .toHex()
            .slice(2)
            .padStart(64, "0")
    );
}

export function fetchERC1155(address: Address): FakeGotchiCardContract {
    let contract = FakeGotchiCardContract.load(address);
    if (!contract) {
        contract = new FakeGotchiCardContract(address);
        contract.asAccount = address.toHex();
        contract.save();

        let account = getOrCreateUser(address.toHex());
        account.asERC1155 = address;
        account.save();
    }

    return contract;
}

export function fetchFakeGotchiCardToken(
    contract: FakeGotchiCardContract,
    identifier: BigInt
): FakeGotchiCardToken {
    let id = contract.id
        .toHex()
        .concat("/")
        .concat(identifier.toHex());
    let token = FakeGotchiCardToken.load(id);

    if (token == null) {
        let erc1155 = IERC1155.bind(Address.fromBytes(contract.id));
        let try_uri = erc1155.try_uri(identifier);
        token = new FakeGotchiCardToken(id);
        token.contract = contract.id;
        token.identifier = identifier;
        token.totalSupply = fetchFakeGotchiCardBalance(token as FakeGotchiCardToken, null).id;
        token.uri = try_uri.reverted
            ? null
            : replaceURI(try_uri.value, identifier);
        token.save();
    }

    return token as FakeGotchiCardToken;
}

export function fetchFakeGotchiCardBalance(
    token: FakeGotchiCardToken,
    account: User | null
): FakeGotchiCardBalance {
    let id = token.id
        .concat("/")
        .concat(account ? account.id.toString() : "totalSupply");
    let balance = FakeGotchiCardBalance.load(id);

    if (balance == null) {
        balance = new FakeGotchiCardBalance(id);
        balance.contract = token.contract;
        balance.token = token.id;
        balance.account = account ? account.id : null;
        balance.value = constants.BIGDECIMAL_ZERO;
        balance.valueExact = constants.BIGINT_ZERO;
        balance.save();
    }

    return balance as FakeGotchiCardBalance;
}