import { test, assert, clearStore, createMockedFunction, newMockEvent } from "matchstick-as/assembly/index";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { handleAavegotchiRentalAdd, handleAavegotchiRentalCanceled, handleERC721ExecutedRental, handleUseConsumables } from "../src/mappings/diamond";
import { AavegotchiRentalAdd, AavegotchiRentalCanceled, ERC721ExecutedRental } from "../generated/AavegotchiDiamond/AavegotchiDiamond";
import { BIGINT_ONE } from "../src/utils/constants";
import { getAavegotchiMock } from "./mocks";
import { Aavegotchi, ERC721RentalListing } from "../generated/schema";


test("AavegotchiLending - add listing", () => {
    // create event
    let newMockevent = newMockEvent();
    let event = new AavegotchiRentalAdd(
        newMockevent.address,
        newMockevent.logIndex,
        newMockevent.transactionLogIndex,
        newMockevent.logType,
        newMockevent.block,
        newMockevent.transaction,
        newMockevent.parameters
    );
    
    event.parameters = new Array<ethereum.EventParam>();
    event.parameters.push(new ethereum.EventParam("rentalId", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("originalOwner", ethereum.Value.fromAddress(Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c"))));
    event.parameters.push(new ethereum.EventParam("erc721TokenAddress", ethereum.Value.fromAddress(Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c"))));
    event.parameters.push(new ethereum.EventParam("erc721TokenId", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("amountPerDay", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("period", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("time", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));


    // execute handler with event
    handleAavegotchiRentalAdd(event);

    // asserts
    assert.fieldEquals("ERC721RentalListing", "1", "owner", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("ERC721RentalListing", "1", "erc721TokenAddress", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("ERC721RentalListing", "1", "tokenId", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "amountPerDay", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "period", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "time", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "cancelled", "false");
    assert.fieldEquals("ERC721RentalListing", "1", "rentee", "");
})

test("AavegotchiLending - execute listing", () => {
    // create event
    let newMockevent = newMockEvent();
    let event = new ERC721ExecutedRental(
        newMockevent.address,
        newMockevent.logIndex,
        newMockevent.transactionLogIndex,
        newMockevent.logType,
        newMockevent.block,
        newMockevent.transaction,
        newMockevent.parameters
    );
    
    event.parameters = new Array<ethereum.EventParam>();
    event.parameters.push(new ethereum.EventParam("rentalId", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("originalOwner", ethereum.Value.fromAddress(Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c"))));
    event.parameters.push(new ethereum.EventParam("renter", ethereum.Value.fromAddress(Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c"))));
    event.parameters.push(new ethereum.EventParam("erc721TokenAddress", ethereum.Value.fromAddress(Address.fromString("0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c"))));
    event.parameters.push(new ethereum.EventParam("erc721TokenId", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("amountPerDay", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("period", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("time", ethereum.Value.fromSignedBigInt(BIGINT_ONE.plus(BIGINT_ONE))));
    
    // execute handler with event
    handleERC721ExecutedRental(event);

    // asserts
    assert.fieldEquals("ERC721RentalListing", "1", "owner", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("ERC721RentalListing", "1", "erc721TokenAddress", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("ERC721RentalListing", "1", "tokenId", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "amountPerDay", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "period", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "time", "2");
    assert.fieldEquals("ERC721RentalListing", "1", "cancelled", "false");
    assert.fieldEquals("ERC721RentalListing", "1", "rentee", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
})

test("AavegotchiLending - cancel listing", () => {
    // create event
    let newMockevent = newMockEvent();
    let event = new AavegotchiRentalCanceled(
        newMockevent.address,
        newMockevent.logIndex,
        newMockevent.transactionLogIndex,
        newMockevent.logType,
        newMockevent.block,
        newMockevent.transaction,
        newMockevent.parameters
    );
    
    event.parameters = new Array<ethereum.EventParam>();
    event.parameters.push(new ethereum.EventParam("rentalId", ethereum.Value.fromSignedBigInt(BIGINT_ONE)));
    event.parameters.push(new ethereum.EventParam("time", ethereum.Value.fromSignedBigInt(BIGINT_ONE.plus(BIGINT_ONE).plus(BIGINT_ONE))));
    
    // execute handler with event
    handleAavegotchiRentalCanceled(event);

    // asserts
    assert.fieldEquals("ERC721RentalListing", "1", "owner", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("ERC721RentalListing", "1", "erc721TokenAddress", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    assert.fieldEquals("ERC721RentalListing", "1", "tokenId", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "amountPerDay", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "period", "1");
    assert.fieldEquals("ERC721RentalListing", "1", "time", "3");
    assert.fieldEquals("ERC721RentalListing", "1", "cancelled", "true");
    assert.fieldEquals("ERC721RentalListing", "1", "rentee", "0x1ad3d72e54fb0eb46e87f82f77b284fc8a66b16c");
    clearStore();
})