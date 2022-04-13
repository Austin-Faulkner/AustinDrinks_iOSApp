//
//  EstablishmentDataManagerTest.swift
//  AustinDrinksTests
//
//  Created by Austin Faulkner on 4/13/22.
//

import XCTest
@testable import AustinDrinks

class EstablishmentDataManagerTest: XCTestCase {
    
    // sut = "System Under Test"
    let sut = EstablishmentDataManager()
    
    private var items: [EstablishmentItem] = []
    var annotations: [EstablishmentItem] {
        items
    }

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        try super.setUpWithError()
        sut.fetch(location: "Austin", selectedEthanol: "All")
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        try super.tearDownWithError()
    }

    func testNumberOfEstablishmentItems() throws {
        XCTAssertTrue(sut.numberOfEstablishmentItems() > 0, "Expecting at least one drinking establishment in the list view. Number in list: \(sut.numberOfEstablishmentItems())")
    }
    
    func testEstablishmentItem() throws {
        // testing establishment items
        let maxNameCheck = 4
        var itemNames: [String] = []
        itemNames.append("Austin Beerworks")
        itemNames.append("Zilker Brewing Company and Taproom")
        itemNames.append("4th Tap Brewing Co-op")
        itemNames.append("Lazarus Brewing")
        var index = 0
        while index < maxNameCheck {
            XCTAssertTrue(sut.establishmentItem(at: index).name == itemNames[index], "ERROR: expecting \(itemNames[index]) for the establishment name!")
            index += 1
        }
    }
}
