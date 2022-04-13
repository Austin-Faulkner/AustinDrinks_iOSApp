//
//  MapDataManagerTest.swift
//  AustinDrinksTests
//
//  Created by Austin Faulkner on 4/13/22.
//

import MapKit
import XCTest
@testable import AustinDrinks

class MapDataManagerTest: XCTestCase {
    
    let sut = MapDataManager()

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        try super.setUpWithError()
        sut.fetch()
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        try super.tearDownWithError()
    }

    func testCurrentRegion() throws {
        let expectedCoordinates: MKCoordinateRegion = sut.currentRegion(latDelta: 0.5, longDelta: 0.5)
        XCTAssertTrue(expectedCoordinates.center.latitude == 30.379575, "ERROR: expecting latitude to be 30.379575 for Austin Beerworks. Should be: \(expectedCoordinates.center.latitude).")
        XCTAssertTrue(expectedCoordinates.center.longitude == -97.729848, "ERROR: expecting longitude to be -97.729848 for Austin Beerworks. Should be: \(expectedCoordinates.center.longitude).")
        XCTAssertTrue(expectedCoordinates.span.latitudeDelta == 0.5, "ERROR: expecting latitudeDelta to be 0.5. Should be: \(expectedCoordinates.span.latitudeDelta).")
        XCTAssertTrue(expectedCoordinates.span.longitudeDelta == 0.5, "ERROR: expecting longitudeDelta to be 0.5. Should be: \(expectedCoordinates.span.longitudeDelta).")    }
}
