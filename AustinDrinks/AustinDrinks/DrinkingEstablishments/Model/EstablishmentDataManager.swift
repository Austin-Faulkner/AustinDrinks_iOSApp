//
//  EstablishmentDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 4/10/22.
//

import Foundation
import UIKit

// Helper class in decoding the JSON structured in EstablishmentItem Model.
// EstablishmentItem has all the attributes contained in each of the 11 JSON
// files, in the right order, and the JSON file communicates with the JSON API Decodable (since
// in AustinDrinsk only needs to decode prior-existing data-collected JSON files).
class EstablishmentDataManager {
    
    private var establishmentItems: [EstablishmentItem] = []
    
    func fetch(location: String, selectedEthanol: String = "All", completionHandler: (_ establishmentItems: [EstablishmentItem]) -> Void) {
        if let file = Bundle.main.url(forResource: location, withExtension: "json") {
            do {
                let data = try Data(contentsOf: file)
                let establishments = try JSONDecoder().decode([EstablishmentItem].self, from: data)
                if selectedEthanol != "All" {
                    establishmentItems = establishments.filter {
                        ($0.tags.contains(selectedEthanol))
                    }
                } else  {
                    establishmentItems = establishments
                }
            } catch {
                print("There was an error \(error)")
            }
        }
        completionHandler(establishmentItems)
    }
    
    // Overloaded fetch method for testing
    func fetch(location: String, selectedEthanol: String = "All") {
        if let file = Bundle.main.url(forResource: location, withExtension: "json") {
            do {
                let data = try Data(contentsOf: file)
                let establishments = try JSONDecoder().decode([EstablishmentItem].self, from: data)
                if selectedEthanol != "All" {
                    establishmentItems = establishments.filter {
                        ($0.tags.contains(selectedEthanol))   // tags -> cuisines
                    }
                } else  {
                    establishmentItems = establishments
                }
            } catch {
                print("There was an error \(error)")
            }
        }
    }
    
    func numberOfEstablishmentItems() -> Int {
        establishmentItems.count
    }
    
    func establishmentItem(at index: Int) -> EstablishmentItem {
        establishmentItems[index]
    }
}
