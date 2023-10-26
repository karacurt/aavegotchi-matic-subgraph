import { ethereum, BigInt } from "@graphprotocol/graph-ts";

import {
    User,
    ERC1155Contract,
    ERC1155Transfer,
    Generation,
} from "../../generated/schema";

import {
    ApprovalForAll as ApprovalForAllEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
    URI as URIEvent,
    NewSeriesStarted as NewSeriesStartedEvent,
    NewSeriesStarted,
} from "../../generated/FAKEGotchisCardDiamond/IERC1155";

import {
    constants,
    decimals,
    events,
    transactions,
} from "@amxx/graphprotocol-utils";

import {
    fetchERC1155,
    fetchERC1155Token,
    fetchERC1155Balance,
    fetchERC721Operator,
    replaceURI,
} from "../fetch/erc1155";
import { getOrCreateUser } from "../utils/helpers/diamond";

function registerTransfer(
    event: ethereum.Event,
    suffix: string,
    contract: ERC1155Contract,
    operator: User,
    from: User,
    to: User,
    id: BigInt,
    value: BigInt
): void {
    let token = fetchERC1155Token(contract, id);
    let ev = new ERC1155Transfer(events.id(event).concat(suffix));
    ev.emitter = token.contract.toHexString();
    ev.transaction = transactions.log(event).id;
    ev.timestamp = event.block.timestamp;
    ev.contract = contract.id;
    ev.token = token.id;
    ev.operator = operator.id;
    ev.value = decimals.toDecimals(value);
    ev.valueExact = value;

    if (from.id == constants.ADDRESS_ZERO.toHexString()) {
        let totalSupply = fetchERC1155Balance(token, null);
        totalSupply.valueExact = totalSupply.valueExact.plus(value);
        totalSupply.value = decimals.toDecimals(totalSupply.valueExact);
        totalSupply.save();
    } else {
        let balance = fetchERC1155Balance(token, from);
        balance.valueExact = balance.valueExact.minus(value);
        balance.value = decimals.toDecimals(balance.valueExact);
        balance.save();

        ev.from = from.id;
        ev.fromBalance = balance.id;
    }

    if (to.id == constants.ADDRESS_ZERO.toHexString()) {
        let totalSupply = fetchERC1155Balance(token, null);
        totalSupply.valueExact = totalSupply.valueExact.minus(value);
        totalSupply.value = decimals.toDecimals(totalSupply.valueExact);
        totalSupply.save();
    } else {
        let balance = fetchERC1155Balance(token, to);
        balance.valueExact = balance.valueExact.plus(value);
        balance.value = decimals.toDecimals(balance.valueExact);
        balance.save();

        ev.to = to.id;
        ev.toBalance = balance.id;
    }

    token.save();
    ev.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
    let contract = fetchERC1155(event.address);
    let operator = getOrCreateUser(event.params._operator.toHex());
    let from = getOrCreateUser(event.params._from.toHex());
    let to = getOrCreateUser(event.params._to.toHex());

    registerTransfer(
        event,
        "",
        contract,
        operator,
        from,
        to,
        event.params._id,
        event.params._value
    );
}

export function handleTransferBatch(event: TransferBatchEvent): void {
    let contract = fetchERC1155(event.address);
    let operator = getOrCreateUser(event.params._operator.toHex());
    let from = getOrCreateUser(event.params._from.toHex());
    let to = getOrCreateUser(event.params._to.toHex());

    let ids = event.params._ids;
    let values = event.params._values;

    // If this equality doesn't hold (some devs actually don't follox the ERC specifications) then we just can't make
    // sens of what is happening. Don't try to make something out of stupid code, and just throw the event. This
    // contract doesn't follow the standard anyway.
    if (ids.length == values.length) {
        for (let i = 0; i < ids.length; ++i) {
            registerTransfer(
                event,
                "/".concat(i.toString()),
                contract,
                operator,
                from,
                to,
                ids[i],
                values[i]
            );
        }
    }
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
    let contract = fetchERC1155(event.address);
    let operator = getOrCreateUser(event.params._operator.toHex());
    let owner = getOrCreateUser(event.params._owner.toHex());
    let delegation = fetchERC721Operator(contract, owner, operator);
    delegation.approved = event.params._approved;
    delegation.save();
}

export function handleURI(event: URIEvent): void {
    let contract = fetchERC1155(event.address);
    let token = fetchERC1155Token(contract, event.params._id);
    token.uri = replaceURI(event.params._value, event.params._id);
    token.save();
}

export function handleNewSeriesStarted(event: NewSeriesStarted): void {
    let series = new Generation(event.params.id.toString());
    series.amount = event.params.amount.toI32();
    series.save();
}
