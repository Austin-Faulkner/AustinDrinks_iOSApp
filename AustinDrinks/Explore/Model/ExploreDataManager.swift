//
//  ExploreDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/12/22.
//

import Foundation  // one of Apple's core frameworks. To read more about it visit https://developer.apple.com/documentation/foundation

class ExploreDataManager: DataManager {
    private var exploreItems: [ExploreItem] = []

    func fetch() {
        for data in loadPlist(file: "ExploreData") {
            print(data)
            exploreItems.append(ExploreItem(dict: data as! [String: String]))
        }
    }
    
    func numberOfExploreItems() -> Int {
        exploreItems.count
    }
    
    func exploreItem(at index: Int) -> ExploreItem {
        exploreItems[index]
    }
}
