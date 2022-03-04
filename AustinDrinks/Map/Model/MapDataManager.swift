//
//  MapDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/3/22.
//

import Foundation
import MapKit
import AVFAudio

class MapDataManager: DataManager {
    private var items: [EstablishmentItem] = []
    var annotations: [EstablishmentItem] {
        items
    }
    
    // Trying this . . .
//    var location = LocationViewController() // TODO: Forget this, it generalizes to the whole U.S.

    
    var selectedCity: LocationItem?
    
    func fetch(completion: (_ annotations: [EstablishmentItem]) -> ()) {
        let manager = EstablishmentDataManager()
        
        
//        let location = LocationViewController() // TODO: Forget this, it generalizes to the whole U.S.
        //--------------------------------------------------
//        guard let city = selectedCity?.city else { return }
        
//        guard let cityChoice = location.selectedCity?.city else { return }
//        print(cityChoice)
        //--------------------------------------------------
        
        
        manager.fetch(location: "Austin", completionHandler: {
//        manager.fetch(location: cityChoice, completionHandler: {
            (establishmentItems) in self.items = establishmentItems
            completion(items)   
        })
    }
    
    func initialRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
    
    func currentRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
}
