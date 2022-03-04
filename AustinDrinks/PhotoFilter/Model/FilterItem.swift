//
//  FilterItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/25/22.
//

import Foundation

struct FilterItem { // FilterData.plist is an array of dictionaries like reviews!!! Use this in the appropriate class file.
    let filter: String?
    let name: String?
    init(dict: [String: String]) {
        self.filter = dict["filter"]
        self.name = dict["name"]
    }
}
