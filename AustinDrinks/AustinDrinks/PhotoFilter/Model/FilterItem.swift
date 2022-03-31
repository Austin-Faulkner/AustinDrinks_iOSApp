//
//  FilterItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/25/22.
//

import Foundation

// Struct for the name and type of the filters the user may use to post his or her (their) photos.
struct FilterItem { 
    let filter: String?
    let name: String?
    init(dict: [String: String]) {
        self.filter = dict["filter"]
        self.name = dict["name"]
    }
}
