//
//  LocationDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/17/22.
//

import Foundation // one of Apple's core frameworks. To read more about it visit https://developer.apple.com/documentation/foundation

class LocationDataManager {
    private var locations: [LocationItem] = []
    
    // Interpretation of the PLIST ("property-list" in XCode)
    // containing the software developer-crafted set of 11 cities.
    private func loadData() -> [[String: String]] {
        let decoder = PropertyListDecoder()
        if let path = Bundle.main.path(forResource: "Locations", ofType: "plist"),
           let locationsData = FileManager.default.contents(atPath: path),
           let locations = try? decoder.decode([[String: String]].self, from: locationsData) {
            return locations
        }
        return [[:]]
    }
    
    func fetch() {
        for location in loadData() {
            locations.append(LocationItem(dict: location))
        }
    }
    
    func numberOfLocationsItems() -> Int {
        locations.count
    }
    
    func locationItem(at index: Int) -> LocationItem {
        locations[index]
    }
}
