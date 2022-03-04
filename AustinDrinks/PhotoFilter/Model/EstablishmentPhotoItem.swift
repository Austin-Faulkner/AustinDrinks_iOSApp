//
//  EstablishmentPhotoItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/17/22.
//

import UIKit

struct EstablishmentPhotoItem {
    var date: Date?
    var photo: UIImage?
    var photoData: Data {
        guard let photo = photo,
              let photoData = photo.pngData() else {
                  return Data()
              }
        return photoData
    }
    var establishmentID: Int64?
    var uuid = UUID()
}

extension EstablishmentPhotoItem {
    init(establishmentPhoto: EstablishmentPhoto) {
        self.date = establishmentPhoto.date
        if let estPhoto = establishmentPhoto.photo {
            self.photo = UIImage(data: estPhoto, scale: 1.0)
        }
        self.establishmentID = establishmentPhoto.establishmentID
        if let estPhotoUUID = establishmentPhoto.uuid {
            self.uuid = estPhotoUUID
        }
    }
}
