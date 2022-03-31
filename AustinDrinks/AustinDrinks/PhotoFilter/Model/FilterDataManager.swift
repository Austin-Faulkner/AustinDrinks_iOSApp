//
//  FilterDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/27/22.
//

import Foundation

// Loads the property list (.plist) for FilterData necessary to stipulate user filter choice.
class FilterDataManager: DataManager {
    func fetch() -> [FilterItem] {
        var filterItems: [FilterItem] = []
        for data in loadPlist(file: "FilterData") {
            filterItems.append(FilterItem(dict: data as! [String: String]))
        }
        return filterItems
    }
}
