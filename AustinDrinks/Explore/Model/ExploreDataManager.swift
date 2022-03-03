//
//  ExploreDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 1/31/22.
//

import Foundation  // one of Apple's core frameworks. To read more about it visit https://developer.apple.com/documentation/foundation

class ExploreDataManager: DataManager {
    private var exploreItems: [ExploreItem] = []

    func fetch() {
        for data in loadPlist(file: "ExploreData") {
            print(data)  // not printing in debug area. Why?
            exploreItems.append(ExploreItem(dict: data as! [String: String]))
        }
    }
    
    //    private func loadData() -> [[String:String]] {
    //    let decoder = PropertyListDecoder()
    //    if let path = Bundle.main.path(forResource: "ExporeData", ofType: "plist"),
    //       let exploreData = FileManager.default.contents(atPath: path),
    //        let exploreItems = try? decoder.decode([[String:String]].self, from: exploreData) {
    //            return exploreItems
    //        }
    //        return [[:]]
    //    }
    
    func numberOfExploreItems() -> Int {
        exploreItems.count
    }
    
    func exploreItem(at index: Int) -> ExploreItem {
        exploreItems[index]
    }
}
