//
//  ExploreDataManager.swift
//  AustinDrinksTests
//
//  Created by Austin Faulkner on 3/8/22.
//

import XCTest
@testable import AustinDrinks

class ExploreDataManagerTest: XCTestCase {
    
    // sut = "System Under Test"
    let sut = ExploreDataManager()
    private var exploreItems: [ExploreItem] = []
    
    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        try super.setUpWithError()
        sut.fetch()
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        try super.tearDownWithError()
    }
    
    func testNumberOfExploreItems() throws {
        XCTAssertTrue(sut.numberOfExploreItems() > 0, "Expecting at least one establishment-type clickable pane item. Pane item(s): \(sut.numberOfExploreItems())")
    }
    
    func testExploreItem() throws {
        
        // Beer - Brewery
        XCTAssertTrue(sut.exploreItem(at: 0).name?.isEmpty != nil, "Expecting a beverage type name in the ExploreItems dictionary.")
        XCTAssertTrue(sut.exploreItem(at: 0).image?.isEmpty != nil, "Expecting a beverage type image in the ExploreItems dictionary.")
        
        // Spirits - Distillery
        XCTAssertTrue(sut.exploreItem(at: 1).name?.isEmpty != nil, "Expecting a beverage type name in the ExploreItems dictionary.")
        XCTAssertTrue(sut.exploreItem(at: 1).image?.isEmpty != nil, "Expecting a beverage type image in the ExploreItems dictionary.")
        
        // Wine - Winery
        XCTAssertTrue(sut.exploreItem(at: 2).name?.isEmpty != nil, "Expecting a beverage type name in the ExploreItems dictionary.")
        XCTAssertTrue(sut.exploreItem(at: 2).image?.isEmpty != nil, "Expecting a beverage type image in the ExploreItems dictionary.")
        
        // Drinking Wisdom - Machine Learning. TODO: Yet to be implemented. For another time.
        XCTAssertTrue(sut.exploreItem(at: 3).name?.isEmpty != nil, "Expecting a beverage type name in the ExploreItems dictionary.")
        XCTAssertTrue(sut.exploreItem(at: 3).image?.isEmpty != nil, "Expecting a beverage type image in the ExploreItems dictionary.")
    }
}
