//
//  EstablishmentDataManager.swift
//  AustinDrinks
//
<<<<<<< HEAD
<<<<<<< HEAD
//  Created by Austin Faulkner on 1/19/22.
=======
//  Created by riemann on 1/19/22.
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
//  Created by riemann on 1/19/22.
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
//

import Foundation
import UIKit

class EstablishmentDataManager {
    private var establishmentItems: [EstablishmentItem] = []
    
    func fetch(location: String, selectedEthanol: String = "All", completionHandler: (_ establishmentItems: [EstablishmentItem]) -> Void) {  // Is there a problem with "All" here?
        if let file = Bundle.main.url(forResource: location, withExtension: "json") {
            do {
                let data = try Data(contentsOf: file)
                let establishments = try JSONDecoder().decode([EstablishmentItem].self, from: data)
                if selectedEthanol != "All" { // Should this be selectedTags?
                    establishmentItems = establishments.filter {
<<<<<<< HEAD
<<<<<<< HEAD
                        ($0.tags.contains(selectedEthanol))   // Boston works with tags -> cuisines
=======
                        ($0.tags.contains(selectedEthanol))     // Is tags the right equivalent to cuisines?
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
                        ($0.tags.contains(selectedEthanol))     // Is tags the right equivalent to cuisines?
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
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
    
    func numberOfEstablishmentItems() -> Int {
        establishmentItems.count
    }
    
    func restaurantItem(at index: Int) -> EstablishmentItem {
        establishmentItems[index]
    }
}
<<<<<<< HEAD
<<<<<<< HEAD
// //                        ($0.tags.contains(selectedEthanol))     // Is tags the right equivalent to cuisines?
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
