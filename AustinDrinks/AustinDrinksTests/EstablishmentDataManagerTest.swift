//
//  EstablishmentDataManagerTest.swift
//  AustinDrinksTests
//
//  Created by Austin Faulkner on 3/8/22.
//

import XCTest
@testable import AustinDrinks

class EstablishmentDataManagerTest: XCTestCase {
    
    // sut = "System Under Test"
    let sut = EstablishmentDataManager()

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        try super.setUpWithError()
//        // TODO: figure out what form the argument for the completionHandler should take. Currently it's a stub.
//        sut.fetch(location: "Austin", selectedEthanol: "All", completionHandler: ???????)
//        sut.fetch(location: <#T##String#>, selectedEthanol: <#T##String#>, completionHandler: <#T##([EstablishmentItem]) -> Void##([EstablishmentItem]) -> Void##(_ establishmentItems: [EstablishmentItem]) -> Void#>)
    }
//
    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        try super.tearDownWithError()
    }

//    func testNumberOfEstablishmentItems() throws {
//        XCTAssertTrue(sut.numberOfEstablishmentItems() > 0, "Expecting at least one drinking establishment in the list view. Number in list: \(sut.numberOfEstablishmentItems())")
//    }
    
//    func testPerformanceExample() throws {
//        // This is an example of a performance test case.
//        self.measure {
//            // Put the code you want to measure the time of here.
//        }
//    }

}
