//
//  MapDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 4/13/22.
//

import Foundation // one of Apple's core frameworks. To read more about it visit https://developer.apple.com/documentation/foundation
import MapKit

// MapDataManager is a DataManager, thus it inherits from DataManager's plist interpretation
class MapDataManager: DataManager {
    private var items: [EstablishmentItem] = []
    var annotations: [EstablishmentItem] {
        items
    }
    var selectedCity: LocationItem?
    
    func fetch(completion: (_ annotations: [EstablishmentItem]) -> ()) {
        let manager = EstablishmentDataManager()
        let locale = LocationDataManager()
        locale.fetch()
        
        selectedCity = locale.locationItem(at: 0) // index
        
        guard let city = selectedCity?.city else { return }
        
        manager.fetch(location: city, completionHandler: {
            (establishmentItems) in self.items = establishmentItems
            completion(items)
        })
    }
    
    // Overloaded fetch method for testing: MapDataManager
    func fetch() {
        let manager = EstablishmentDataManager()
        let city = "Austin"
        
        manager.fetch(location: city, completionHandler: {
            (establishmentItems) in self.items = establishmentItems
        })
    }
    
    func currentRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
}

