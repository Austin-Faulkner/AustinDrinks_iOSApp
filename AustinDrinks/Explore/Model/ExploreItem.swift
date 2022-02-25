//
//  ExploreItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 1/12/22.
//

import Foundation // one of Apple's core frameworks. To read more about it visit https://developer.apple.com/documentation/foundation

struct ExploreItem {
    let name: String? // Need this?
    let image: String?
}

let myExploreItem = ExploreItem(name: "name", image: "image")

extension ExploreItem {
    init(dict: [String: String]) {
        self.name = dict["name"]  // Need this?
        self.image = dict["image"]
    }
}
