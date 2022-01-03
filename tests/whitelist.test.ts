import { Address, ethereum } from "@graphprotocol/graph-ts";
import { assert, createMockedFunction, mockFunction, newMockEvent, test } from "matchstick-as";
import { WhitelistCreated, WhitelistUpdated } from "../generated/AavegotchiDiamond/AavegotchiDiamond";
import { handleWhitelistCreated, handleWhitelistUpdated } from "../src/mappings/diamond";
import { BIGINT_ONE } from "../src/utils/constants";

test("Whitelist - created", () => {
    // create event
    let newMockevent = newMockEvent();
    let event = new WhitelistCreated(
        newMockevent.address,
        newMockevent.logIndex,
        newMockevent.transactionLogIndex,
        newMockevent.logType,
        newMockevent.block,
        newMockevent.transaction,
        newMockevent.parameters
    );
    
    event.parameters = new Array<ethereum.EventParam>();
    event.parameters.push(new ethereum.EventParam("whitelistId", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));

    // mock getWhitelist call
    createMockedFunction(
        newMockevent.address,
        "getWhitelist",
        "getWhitelist(uint256):((address,string,address[]))")
        .withArgs([ethereum.Value.fromUnsignedBigInt(BIGINT_ONE)])
        .returns([ethereum.Value.fromTuple(changetype<ethereum.Tuple>([
            ethereum.Value.fromAddress(Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c")),
            ethereum.Value.fromString("My Whitelist #1"),
            ethereum.Value.fromAddressArray([
                Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c")
            ])
        ]))]);
    
    // execute handler with event
    handleWhitelistCreated(event);

    // asserts
    assert.fieldEquals("Whitelist", "1", "id", "1");
    assert.fieldEquals("Whitelist", "1", "name", "My Whitelist #1");
    assert.fieldEquals("Whitelist", "1", "owner", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("Whitelist", "1", "addresses", "[0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c]");
})

test("Whitelist - updated", () => {
    // create event
    let newMockevent = newMockEvent();
    let event = new WhitelistUpdated(
        newMockevent.address,
        newMockevent.logIndex,
        newMockevent.transactionLogIndex,
        newMockevent.logType,
        newMockevent.block,
        newMockevent.transaction,
        newMockevent.parameters
    );
    
    event.parameters = new Array<ethereum.EventParam>();
    event.parameters.push(new ethereum.EventParam("whitelistId", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));

    // mock getWhitelist call
    createMockedFunction(
        newMockevent.address,
        "getWhitelist",
        "getWhitelist(uint256):((address,string,address[]))")
        .withArgs([ethereum.Value.fromUnsignedBigInt(BIGINT_ONE)])
        .returns([ethereum.Value.fromTuple(changetype<ethereum.Tuple>([
            ethereum.Value.fromAddress(Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c")),
            ethereum.Value.fromString("My Whitelist #2"),
            ethereum.Value.fromAddressArray([
                Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c")
            ])
        ]))]);
    
    // execute handler with event
    handleWhitelistUpdated(event);

    // asserts
    assert.fieldEquals("Whitelist", "1", "id", "1");
    assert.fieldEquals("Whitelist", "1", "name", "My Whitelist #2");
    assert.fieldEquals("Whitelist", "1", "owner", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("Whitelist", "1", "addresses", "[0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c]");
})