//
//  CoreDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/18/22.
//

import CoreData
import Foundation

// How the Reviews and Photos are saved to the user's device for sharing
struct CoreDataManager {
    let container: NSPersistentContainer
    init() {
        container = NSPersistentContainer(name: "AustinDrinksModel")
        container.loadPersistentStores {
            (storeDesc, error) in
            error.map {
                print($0)
            }
        }
    }
    
    func addReview(_ reviewItem: ReviewItem) {
        let review = Review(context: container.viewContext)
        review.date = Date()
        if let reviewItemRating = reviewItem.rating {
            review.rating = reviewItemRating
        }
        review.title = reviewItem.title
        review.name = reviewItem.name
        review.customerReview = reviewItem.customerReview
        if let reviewItemEstID = reviewItem.establishmentID {
            review.establishmentID = reviewItemEstID
        }
        review.uuid = reviewItem.uuid
        save()
    }
    
    func fetchEstablishmentRating(by identifier: Int) -> Double {
        let reviewItems = fetchReviews(by: identifier)
        let sum = reviewItems.reduce(0, {$0 + ($1.rating ?? 0)})
        return sum / Double(reviewItems.count)
    }
    
    func addPhoto(_ estPhotoItem: EstablishmentPhotoItem) {
        let estPhoto = EstablishmentPhoto(context: container.viewContext)
        estPhoto.date = Date()
        estPhoto.photo = estPhotoItem.photoData
        if let estPhotoID = estPhotoItem.establishmentID {
            estPhoto.establishmentID = estPhotoID
        }
        estPhoto.uuid = estPhotoItem.uuid
        save()
    }
    
    func fetchReviews(by identifier: Int) -> [ReviewItem] {
        let moc = container.viewContext
        let request = Review.fetchRequest()
        let predicate = NSPredicate(format: "establishmentID = %i", identifier)
        var reviewItems: [ReviewItem] = []
        request.sortDescriptors = [NSSortDescriptor(key: "date", ascending: false)]
        request.predicate = predicate
        do {
            for review in try moc.fetch(request) {
                reviewItems.append(ReviewItem(review: review))
            }
            return reviewItems
        } catch {
            fatalError("Failed to fetch reviews: \(error)")
        }
    }
    
    func fetchRestPhotos(by identifier: Int) -> [EstablishmentPhotoItem] {
        let moc = container.viewContext
        let request = EstablishmentPhoto.fetchRequest()
        let predicate = NSPredicate(format: "establishmentID = %i", identifier)
        var estPhotoItems: [EstablishmentPhotoItem] = []
        request.sortDescriptors = [NSSortDescriptor(key: "date", ascending: false)]
        request.predicate = predicate
        do {
            for estPhoto in try moc.fetch(request) {
                estPhotoItems.append(EstablishmentPhotoItem(establishmentPhoto: estPhoto))
            }
            return estPhotoItems
        } catch {
            fatalError("Failed to fetch establishment photos: \(error)")
        }
    }
    
    
    private func save() {
        do {
            if container.viewContext.hasChanges {
                try container.viewContext.save()
            }
        } catch let error {
            print(error.localizedDescription)
        }
    }
}

extension CoreDataManager {
    static var shared = CoreDataManager()
}
