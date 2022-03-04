//
//  EstablishmentDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/3/22.
//

import Foundation
import UIKit

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
    
    func numberOfEstablishmentItems() -> Int {
        establishmentItems.count
    }
    
    func establishmentItem(at index: Int) -> EstablishmentItem {
        establishmentItems[index]
    }
}
