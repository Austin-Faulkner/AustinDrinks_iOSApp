//
//  LocationItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/5/22.
//

import Foundation

struct LocationItem: Equatable {
    let city: String?
    let state: String?
}

extension LocationItem {
    init(dict: [String: String]) {
        self.city = dict["city"]
        self.state = dict["state"]
    }
    
    var cityAndState: String {
        guard let city = self.city,
              let state = self.state
        else {
            return ""
        }
        return "\(city), \(state)"
    }
}
