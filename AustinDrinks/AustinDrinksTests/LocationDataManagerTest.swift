//
//  LocationDataManagerTest.swift
//  AustinDrinksTests
//
//  Created by Austin Faulkner on 3/8/22.
//

import XCTest
@testable import AustinDrinks

class LocationDataManagerTest: XCTestCase {
    
    // sut = "System Under Test"
    let sut = LocationDataManager()

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        try super.setUpWithError()
        sut.fetch()
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        try super.tearDownWithError()
    }
    
    func testNumberOfLocationItems() throws  {
        XCTAssertTrue(sut.numberOfLocationsItems() > 0, "Expecting at least one avaiable choice for location. Number of locations: \(sut.numberOfLocationsItems())")
    }
    
    
    func testLocationItem() throws {
        
        // Austin, TX
        XCTAssertTrue(sut.locationItem(at: 0).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 0).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // Cedar Park, TX
        XCTAssertTrue(sut.locationItem(at: 1).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 1).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // Dripping Springs, TX
        XCTAssertTrue(sut.locationItem(at: 2).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 2).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // Fredericksburg, TX
        XCTAssertTrue(sut.locationItem(at: 3).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 3).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // Georgetown, TX
        XCTAssertTrue(sut.locationItem(at: 4).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 4).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // Marble Falls, TX
        XCTAssertTrue(sut.locationItem(at: 5).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 5).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // New Braunfels, TX
        XCTAssertTrue(sut.locationItem(at: 6).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 6).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // Round Rock, TX
        XCTAssertTrue(sut.locationItem(at: 7).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 7).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // San Antonio, TX
        XCTAssertTrue(sut.locationItem(at: 8).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 8).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // San Marcos, TX
        XCTAssertTrue(sut.locationItem(at: 9).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 9).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
        
        // Wimberley, TX
        XCTAssertTrue(sut.locationItem(at: 10).city != nil, "Expecting a city in Austin or the surrounding area in the LocationItems dictionary.")
        XCTAssertTrue(sut.locationItem(at: 10).state != nil, "Expecting a state (TX) in the LocationItems dictionary.")
    }
}
